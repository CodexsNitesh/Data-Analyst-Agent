from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.tools.schema_tool import make_schema_tool
from app.tools.sql_tool import make_sql_tool, validate_sql
from app.core.config import settings
import json
import re

SYSTEM_PROMPT = """You are an expert SQL analyst for a sales analytics platform.

You have access to a database table. Always:
1. First retrieve the schema to understand available columns
2. Generate a valid PostgreSQL SELECT query
3. Execute the query
4. Summarize results in plain English

Format your final response as:
SQL_QUERY: <the sql query>
ANSWER: <natural language answer>

Rules:
- Only SELECT queries. Never DELETE, DROP, UPDATE, INSERT, ALTER.
- Use double quotes for table/column names if they contain special characters.
- Limit results to 500 rows maximum unless user requests more.
- If data is insufficient, say so clearly.
"""


def build_sql_agent(table_name: str) -> AgentExecutor:
    llm = ChatGroq(
        model=settings.MODEL_NAME,
        api_key=settings.GROQ_API_KEY,
        temperature=0,
    )
    tools = [make_schema_tool(table_name), make_sql_tool(table_name)]
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder("chat_history", optional=True),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])
    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True, max_iterations=5)


def parse_agent_output(output: str) -> tuple[str, str]:
    sql = ""
    answer = output
    sql_match = re.search(r"SQL_QUERY:\s*(.*?)(?=ANSWER:|$)", output, re.DOTALL | re.IGNORECASE)
    answer_match = re.search(r"ANSWER:\s*(.*)", output, re.DOTALL | re.IGNORECASE)
    if sql_match:
        sql = sql_match.group(1).strip()
    if answer_match:
        answer = answer_match.group(1).strip()
    return sql, answer


def run_sql_agent(table_name: str, question: str, chat_history: list = []) -> dict:
    agent = build_sql_agent(table_name)
    result = agent.invoke({"input": question, "chat_history": chat_history})
    raw = result.get("output", "")
    sql, answer = parse_agent_output(raw)

    table_data = []
    for action, observation in result.get("intermediate_steps", []):
        if hasattr(action, 'tool') and 'execute_sql' in action.tool:
            try:
                parsed = json.loads(observation)
                if "rows" in parsed:
                    table_data = parsed["rows"]
            except Exception:
                pass

    return {"answer": answer, "sql": sql, "table_data": table_data}