from langchain.tools import tool
from sqlalchemy import text
from app.db.session import sync_engine
import json


def get_schema_for_table(table_name: str) -> str:
    try:
        with sync_engine.connect() as conn:
            result = conn.execute(text(
                "SELECT column_name, data_type FROM information_schema.columns "
                "WHERE table_name = :table ORDER BY ordinal_position"
            ), {"table": table_name})
            columns = [{"name": row[0], "type": row[1]} for row in result.fetchall()]
            return json.dumps({"table": table_name, "columns": columns})
    except Exception as e:
        return json.dumps({"error": str(e)})


def make_schema_tool(table_name: str):
    @tool
    def get_schema(query: str = "") -> str:
        """Returns the schema for table"""
        return get_schema_for_table(table_name)
    get_schema.name = f"get_schema_{table_name}"
    get_schema.description = f"Get the schema (columns and types) for table {table_name}"
    return get_schema