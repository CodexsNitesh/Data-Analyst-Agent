from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
import json

INSIGHT_SYSTEM = """You are a senior business analyst. Given a dataset schema and sample data, generate 5 actionable business insights.
Return ONLY a JSON array of strings. Each string is one insight. No markdown, no explanation outside JSON."""


def generate_insights(schema_info: list, sample_rows: list) -> list[str]:
    llm = ChatGroq(model=settings.MODEL_NAME, api_key=settings.GROQ_API_KEY, temperature=0.3)
    schema_str = json.dumps(schema_info, indent=2)
    sample_str = json.dumps(sample_rows[:10], indent=2)

    messages = [
        SystemMessage(content=INSIGHT_SYSTEM),
        HumanMessage(content=f"Schema:\n{schema_str}\n\nSample Data:\n{sample_str}"),
    ]

    try:
        response = llm.invoke(messages)
        content = response.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
    except Exception:
        return ["Upload more data to generate insights.", "Ensure your dataset has sales, revenue, or order columns."]