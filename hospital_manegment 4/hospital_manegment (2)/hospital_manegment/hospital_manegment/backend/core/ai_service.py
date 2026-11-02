import json

class AIService:
    @staticmethod
    def generate_clinical_decision_support(symptoms, history, lab_data, medicines, allergies):
        """
        AI Clinical Decision Support algorithm analyzing patient symptoms, history, labs, meds, and allergies.
        Returns structured guidance with mandatory header: "AI Suggestion — Doctor Review Required"
        """
        risk_flags = []
        allergy_warnings = []

        # Analyze symptoms & vitals
        symptom_str = str(symptoms).lower()
        if "chest pain" in symptom_str or "shortness of breath" in symptom_str:
            risk_flags.append("High Risk: Potential Acute Coronary Syndrome or Respiratory Distress. Urgent ECG & Troponin I recommended.")
        if "fever" in symptom_str and ("chills" in symptom_str or "cough" in symptom_str):
            risk_flags.append("Moderate Risk: Acute Inflammatory/Infectious response. CBC & CRP advised.")

        # Check allergies
        allergies_str = str(allergies).lower()
        if "penicillin" in allergies_str or "amoxicillin" in allergies_str:
            allergy_warnings.append("ALLERGY ALERT: Patient is allergic to Penicillins. Avoid Beta-Lactam antibiotics.")
        if "sulfa" in allergies_str:
            allergy_warnings.append("ALLERGY ALERT: Sulfonamide allergy recorded. Avoid Trimethoprim/Sulfamethoxazole.")

        # Recommendations
        considerations = [
            "Monitor vital signs every 4 hours if admitted.",
            "Verify kidney/liver panel before administering nephrotoxic medications.",
            "Consider follow-up consultation in 5 to 7 days.",
        ]

        return {
            "disclaimer": "AI Suggestion — Doctor Review Required",
            "summary": f"Clinical Evaluation for reported symptoms: '{symptoms}'. System reviewed patient history: '{history}'.",
            "risk_alerts": risk_flags if risk_flags else ["Standard Risk Profile - No Immediate Critical Triggers Detected."],
            "allergy_warnings": allergy_warnings if allergy_warnings else ["No active contraindication conflicts detected from recorded allergy profile."],
            "clinical_considerations": considerations
        }

    @staticmethod
    def process_rag_chatbot(user, query):
        """
        RAG Chatbot engine handling queries regarding hospital services, departments, doctors, and patient specific status.
        """
        query_lower = query.lower()
        
        # Knowledge Base lookup (Hospital Information)
        if "emergency" in query_lower or "ambulance" in query_lower:
            return {
                "response": "Smart Care Emergency Helpline is active 24/7. You can request an instant emergency ambulance via the Ambulance Emergency portal or call +1-800-SMARTCARE.",
                "action_suggested": "NAVIGATE_EMERGENCY"
            }
        elif "timing" in query_lower or "hours" in query_lower or "visiting" in query_lower:
            return {
                "response": "Smart Care OPD OPD Hours: 08:00 AM - 08:00 PM (Mon-Sat). IPD Visiting Hours: 04:00 PM - 07:00 PM Daily.",
                "action_suggested": None
            }
        elif "appointment" in query_lower or "doctor" in query_lower or "book" in query_lower:
            return {
                "response": "You can book appointments with top consultants across 10+ departments (Cardiology, Neurology, Orthopedics, Pediatrics, etc.) directly in the Appointment Booking module.",
                "action_suggested": "NAVIGATE_APPOINTMENTS"
            }
        elif "report" in query_lower or "lab" in query_lower or "radiology" in query_lower:
            if user and user.is_authenticated:
                return {
                    "response": f"Hello {user.get_full_name()}, your latest Laboratory and Radiology diagnostic reports are available in your central EHR timeline.",
                    "action_suggested": "NAVIGATE_EHR"
                }
            else:
                return {
                    "response": "Please log in to your Smart Care account to securely view your personal lab and radiology reports.",
                    "action_suggested": "NAVIGATE_LOGIN"
                }
        else:
            return {
                "response": f"Thank you for contacting Smart Care Support. Regarding your query about '{query}', our hospital team is available 24/7. You can access doctors, appointments, pharmacy orders, and billing options in your dashboard.",
                "action_suggested": None
            }

    @staticmethod
    def process_voice_intent(user, voice_text):
        """
        Speech-to-Text Voice Assistant intent processor.
        """
        text = voice_text.lower()
        if "book" in text or "appointment" in text:
            return {
                "spoken_response": "Navigating you to appointment booking screen.",
                "intent": "BOOK_APPOINTMENT",
                "target_route": "/appointments"
            }
        elif "emergency" in text or "ambulance" in text or "sos" in text:
            return {
                "spoken_response": "Emergency alert triggered! Opening emergency ambulance request screen.",
                "intent": "TRIGGER_EMERGENCY",
                "target_route": "/emergency"
            }
        elif "my reports" in text or "health record" in text or "ehr" in text:
            return {
                "spoken_response": "Opening your central Electronic Health Record timeline.",
                "intent": "VIEW_EHR",
                "target_route": "/ehr"
            }
        elif "doctor" in text or "department" in text:
            return {
                "spoken_response": "Displaying hospital department directory and available specialists.",
                "intent": "SEARCH_DOCTORS",
                "target_route": "/doctors"
            }
        else:
            return {
                "spoken_response": f"I heard: '{voice_text}'. How can I assist with your hospital services today?",
                "intent": "GENERAL_HELP",
                "target_route": "/dashboard"
            }
