import os
import logging
import requests
import json

logger = logging.getLogger(__name__)

class BaseAIProvider:
    def generate(self, prompt, context=None, question=None, role=None):
        raise NotImplementedError

class OpenAIProvider(BaseAIProvider):
    def __init__(self, api_key, model="gpt-4o-mini"):
        self.api_key = api_key
        self.model = model

    def generate(self, prompt, context=None, question=None, role=None):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        resp = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=15)
        if resp.status_code == 200:
            return resp.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"OpenAI API Error: {resp.status_code} - {resp.text}")

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key, model="gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model

    def generate(self, prompt, context=None, question=None, role=None):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        if resp.status_code == 200:
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        else:
            raise Exception(f"Gemini API Error: {resp.status_code} - {resp.text}")

class LocalRuleEngineProvider(BaseAIProvider):
    """
    Database-aware local intelligence engine that formats exact, real database data
    retrieved from the context builder according to question intent.
    """
    def generate(self, prompt, context=None, question=None, role=None):
        q = (question or "").lower()
        r = (role or "").lower()
        ctx = context or {}
        intent = ctx.get("intent", "GENERAL")

        # =========================================================
        # PATIENT ROLE RESPONSES (Real DB Driven)
        # =========================================================
        if r == 'patient':
            if intent in ["UPCOMING_APPOINTMENT", "APPOINTMENT_STATUS"]:
                next_apt = ctx.get("next_appointment")
                if next_apt:
                    return f"Your next appointment is with **{next_apt['doctor']}** in **{next_apt['department']}** on **{next_apt['date']}** at **{next_apt['time']}**. Status: **{next_apt['status']}**."
                
                up_apts = ctx.get("upcoming_appointments", [])
                if up_apts:
                    a = up_apts[0]
                    return f"Your next appointment is with **{a['doctor']}** in **{a['department']}** on **{a['date']}** at **{a['time']}**. Status: **{a['status']}**."
                
                past_apts = ctx.get("past_appointments", [])
                if past_apts:
                    p = past_apts[0]
                    return f"You currently have no upcoming scheduled appointments. Your last completed appointment was with **{p['doctor']}** ({p['department']}) on **{p['date']}** at **{p['time']}**."
                
                return "You currently have no scheduled appointments in system records."

            elif intent == "PAST_APPOINTMENT":
                past_apts = ctx.get("past_appointments", [])
                if past_apts:
                    lines = [f"- **{p['doctor']}** ({p['department']}) on **{p['date']}** at {p['time']} [Status: {p['status']}] - Reason: {p['notes']}" for p in past_apts]
                    return "**Your Past Appointments History**:\n" + "\n".join(lines)
                return "No past appointment history found in your patient record."

            elif intent == "MY_DOCTOR":
                doctors = ctx.get("assigned_doctors", [])
                if doctors:
                    return f"Your assigned consulting doctor(s):\n- " + "\n- ".join([f"**{d}**" for d in doctors])
                return "No primary doctor assigned in your medical records."

            elif intent == "LAB_REPORT":
                labs = ctx.get("lab_reports", [])
                if labs:
                    lab = labs[0]
                    res_info = f"\n- **Results**: {json.dumps(lab.get('result_data', {}))}" if lab.get('result_data') else ""
                    remarks = f"\n- **Remarks**: {lab.get('remarks')}" if lab.get('remarks') else ""
                    return f"Your latest lab report is **{lab['test_name']}** ({lab['category']}) requested on **{lab['date']}**.\n- **Status**: **{lab['status']}**{res_info}{remarks}"
                return "No laboratory reports found in your record."

            elif intent == "PRESCRIPTION":
                rxs = ctx.get("prescriptions", [])
                if rxs:
                    rx = rxs[0]
                    meds = rx.get("medicines", [])
                    if isinstance(meds, list):
                        med_lines = [f"  - **{m.get('medicine_name', 'Medicine')}** ({m.get('dosage', '')}): {m.get('frequency', '')} for {m.get('duration', '')}" for m in meds]
                        med_str = "\n".join(med_lines)
                    else:
                        med_str = f"  - {str(meds)}"

                    inst = f"\n- **Instructions**: {rx.get('instructions')}" if rx.get('instructions') else ""
                    return f"Your current prescription from **{rx['doctor']}** (Date: **{rx['date']}**):\n{med_str}{inst}\n\n*Please take medicines strictly as directed by your physician.*"
                return "No active prescriptions recorded in your profile."

            elif intent == "RADIOLOGY_REPORT":
                rads = ctx.get("radiology_reports", [])
                if rads:
                    r_item = rads[0]
                    finds = f"\n- **Findings**: {r_item.get('findings')}" if r_item.get('findings') else ""
                    impr = f"\n- **Impression**: {r_item.get('impression')}" if r_item.get('impression') else ""
                    return f"Your latest radiology report is **{r_item['modality']}** ({r_item['body_part']}) requested on **{r_item['date']}**.\n- **Status**: **{r_item['status']}**{finds}{impr}"
                return "No radiology scan reports found in your record."

            elif intent == "BILLING":
                bills = ctx.get("bills", [])
                if bills:
                    b_lines = [f"- Invoice **#{b['invoice_number']}** ({b['source']}): Total Amount Rs. {b['total_amount']} [Status: **{b['status']}**]" for b in bills]
                    return "**Your Patient Invoices & Billing Summary**:\n" + "\n".join(b_lines)
                return "You have no outstanding or pending bills recorded."

            elif intent == "HOSPITAL_FACILITIES":
                depts = ctx.get("departments", [])
                dept_str = ", ".join(depts) if depts else "Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine, General Surgery, ENT, Ophthalmology, Dermatology"
                return f"**Smart Care Hospital Facilities & Services**:\n- **Departments**: {dept_str}\n- **Facilities**: 24/7 Emergency ER, ICU Wards, Pathology LIS Diagnostic Lab, RIS Radiology (X-Ray/CT/MRI), In-house Pharmacy, and Emergency Ambulance Fleet."

            elif intent == "FOLLOW_UP":
                next_apt = ctx.get("next_appointment")
                if next_apt:
                    return f"Your follow-up is scheduled with **{next_apt['doctor']}** ({next_apt['department']}) on **{next_apt['date']}** at **{next_apt['time']}**."
                return "Please check your latest consultation summary for follow-up details or schedule a follow-up appointment."

            else:
                prof = ctx.get("patient_profile", {})
                next_apt = ctx.get("next_appointment")
                apt_str = f"Your next appointment is on **{next_apt['date']}** at **{next_apt['time']}** with **{next_apt['doctor']}**." if next_apt else "No upcoming appointments."
                return f"Hello **{prof.get('name', 'Patient')}** (Patient ID: **{prof.get('patient_id', 'PAT-2026-8942')}**). {apt_str} How else can I assist you with your health records today?"

        # =========================================================
        # DOCTOR ROLE RESPONSES
        # =========================================================
        elif r == 'doctor':
            todays = ctx.get("todays_appointments", [])
            if todays:
                apt_list = "\n".join([f"- Token #{a['token']}: **{a['patient_name']}** ({a['time']}) - Status: {a['status']}" for a in todays])
                return f"**Today's Consultation Queue ({len(todays)} Patients)**:\n{apt_list}"
            return "No appointments scheduled for you today."

        # =========================================================
        # NURSE ROLE RESPONSES
        # =========================================================
        elif r == 'nurse':
            pts = ctx.get("assigned_ipd_patients", [])
            if pts:
                pt_list = "\n".join([f"- Ward **{p['ward']}** (Bed {p['bed_number']}): **{p['patient_name']}** ({p['patient_id']})" for p in pts])
                return f"**Assigned IPD Ward Patients ({len(pts)})**:\n{pt_list}"
            return "No IPD ward patients currently assigned."

        # =========================================================
        # PHARMACY ROLE RESPONSES
        # =========================================================
        elif r in ['pharmacist', 'pharmacy']:
            low = ctx.get("low_stock_medicines", [])
            if low:
                med_list = "\n".join([f"- **{m['name']}**: Stock = {m['stock']} (Reorder Level: {m['reorder_level']})" for m in low])
                return f"⚠️ **Low Stock Medicine Alert ({len(low)} Items)**:\n{med_list}"
            return "All pharmacy medicines are above reorder levels."

        # =========================================================
        # LAB / RADIOLOGY ROLE RESPONSES
        # =========================================================
        elif r in ['laboratory technician', 'lab', 'radiologist']:
            pending = ctx.get("pending_lab_requests", [])
            if pending:
                p_list = "\n".join([f"- Request #{p['request_number']}: **{p['test_name']}** for {p['patient']} [{p['status']}]" for p in pending])
                return f"🧪 **Pending Laboratory Queue ({ctx.get('pending_count', 0)} Total)**:\n{p_list}"
            return "No pending lab requests."

        # =========================================================
        # ADMIN / OTHER ROLES
        # =========================================================
        else:
            return f"📊 **Smart Care Hospital Overview**:\n" \
                   f"- Today's Scheduled Appointments: **{ctx.get('today_appointments_count', 0)}**\n" \
                   f"- Registered Patients Total: **{ctx.get('total_patients_count', 0)}**\n" \
                   f"- Pending Unpaid Invoices: **{ctx.get('pending_bills_count', 0)}**\n" \
                   f"- Pending Diagnostics Requests: **{ctx.get('pending_lab_count', 0)}**"

class AIEngine:
    @staticmethod
    def generate_response(user, role, context, question):
        provider_name = os.environ.get("AI_PROVIDER", "local").lower().strip()
        api_key = os.environ.get("AI_API_KEY", "").strip()
        model_name = os.environ.get("AI_MODEL", "").strip()

        from .prompts import build_role_prompt
        prompt = build_role_prompt(role, context, question)

        provider = None
        if provider_name == "openai" and api_key:
            provider = OpenAIProvider(api_key, model=model_name or "gpt-4o-mini")
        elif provider_name in ["gemini", "google"] and api_key:
            provider = GeminiProvider(api_key, model=model_name or "gemini-1.5-flash")

        if provider:
            try:
                logger.info(f"Using external AI Provider '{provider_name}'...")
                return provider.generate(prompt, context=context, question=question, role=role)
            except Exception as e:
                logger.warning(f"External AI Provider '{provider_name}' failed: {e}. Falling back to Local Rule Engine.")

        local_provider = LocalRuleEngineProvider()
        return local_provider.generate(prompt, context=context, question=question, role=role)
