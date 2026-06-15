from langchain.tools import tool
from sqlalchemy import text
from app.db.session import sync_engine
from app.core.logging import get_logger
import json
import re

logger = get_logger(__name__)

BLOCKED = ["DELETE", "DROP", "UPDATE", "ALTER", "TRUNCATE", "INSERT", "CREATE", "GRANT", "REVOKE"]


def validate_sql(sql: str) -> tuple[bool, str]:
    normalized = sql.upper().strip()
    for kw in BLOCKED:
        if re.search(rf'\b{kw}\b', normalized):
            return False, f"Forbidden keyword: {kw}"
    if not normalized.startswith("SELECT"):
        return False, "Only SELECT queries allowed."
    return True, "OK"


def make_sql_tool(table_name: str):
    @tool
    def execute_sql(sql: str) -> str:
        """
        Execute a SQL SELECT query against the dataset and return JSON results.
        """
        is_valid, msg = validate_sql(sql)
        if not is_valid:
            return json.dumps({"error": msg})
        try:
            with sync_engine.connect() as conn:
                result = conn.execute(text(sql))
                columns = list(result.keys())
                rows = [dict(zip(columns, row)) for row in result.fetchall()]
                return json.dumps({"columns": columns, "rows": rows, "count": len(rows)})
        except Exception as e:
            logger.error(f"SQL execution error: {e}")
            return json.dumps({"error": str(e)})
    execute_sql.name = f"execute_sql_{table_name}"
    execute_sql.description = f"Execute a SQL SELECT query on the {table_name} table"
    return execute_sql