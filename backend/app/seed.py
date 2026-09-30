import json
import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.entities import (
    User,
    StudentProfile,
    Scholarship,
    ScholarshipRule,
    Document,
    Application,
    AuditLog
)
from app.services.auth import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Scholarship).count() > 0:
            print("Database already contains records. Skipping seed.")
            return

        print("Seeding initial ScholarLink database records...")
        
        # 1. Create Default Users (Student, Verifier, Admin)
        # Student
        student_user = User(
            email="rahul.verma@example.edu",
            full_name="Rahul Verma",
            hashed_password=hash_password("student123"),
            role="STUDENT"
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        student_profile = StudentProfile(
            user_id=student_user.id,
            name="Rahul Verma",
            gender="Male",
            dob="2003-08-14",
            phone="9876543210",
            email="rahul.verma@example.edu",
            can_number="CAN-2025-98241",
            caste="OBC",
            community="Backward Class (BC-C)",
            annual_income=180000.0,
            current_course="B.Tech Computer Science & Engineering",
            institution_name="National Institute of Technology",
            marks_percentage=84.5,
            completion_percentage=85,
            google_synced=True,
            google_sync_notes="Verified destination: Google Sheet ID 1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg."
        )
        db.add(student_profile)

        # Verifier
        verifier_user = User(
            email="officer.sharma@scholarlink.gov.in",
            full_name="Sanjay Sharma",
            hashed_password=hash_password("verifier123"),
            role="VERIFIER"
        )
        db.add(verifier_user)

        # Admin
        admin_user = User(
            email="admin@scholarlink.gov.in",
            full_name="Dr. Aruna Sengupta",
            hashed_password=hash_password("admin123"),
            role="ADMIN"
        )
        db.add(admin_user)
        db.commit()

        # 2. Real-Style Scholarships with Knowledge Base Rules
        scholarships_data = [
            {
                "title": "Central Sector Scheme of Scholarships for College and University Students",
                "provider": "Department of Higher Education, Ministry of Education",
                "category": "Higher Education",
                "amount_display": "₹20,000 / year (UG & PG)",
                "amount_value": 20000.0,
                "deadline": "15 Nov 2026",
                "description": "Financial assistance to meritorious students from economically weaker sections pursuing undergraduate and postgraduate degree courses in recognized universities and colleges.",
                "version": "v1.2",
                "rules": {
                    "min_marks": 80.0,
                    "max_income": 450000.0,
                    "allowed_castes": ["ALL"],
                    "allowed_courses": ["ALL"],
                    "required_documents": ["Income Certificate", "Academic Marksheet", "Aadhaar Card", "Bank Passbook"],
                    "gender_preference": "ANY"
                }
            },
            {
                "title": "Post-Matric Scholarship Scheme for OBC / EBC Candidates",
                "provider": "Ministry of Social Justice & Empowerment",
                "category": "Post-Matric",
                "amount_display": "₹45,000 / year + Tuition Fee Exemption",
                "amount_value": 45000.0,
                "deadline": "31 Oct 2026",
                "description": "Centrally sponsored scheme to provide financial support to Other Backward Classes (OBC) and Economically Backward Classes (EBC) students studying at post-matriculation or post-secondary stages.",
                "version": "v1.4",
                "rules": {
                    "min_marks": 50.0,
                    "max_income": 250000.0,
                    "allowed_castes": ["OBC", "EWS", "BC"],
                    "allowed_courses": ["B.Tech", "BE", "MBBS", "B.Sc", "Diploma", "B.Com"],
                    "required_documents": ["Income Certificate", "Community/Caste Certificate", "Academic Certificate", "Fee Receipt"],
                    "gender_preference": "ANY"
                }
            },
            {
                "title": "Merit-cum-Means Scholarship for Professional and Technical Courses CS",
                "provider": "Ministry of Minority Affairs",
                "category": "Merit-cum-Means",
                "amount_display": "₹30,000 / year + Full Maintenance Allowance",
                "amount_value": 30000.0,
                "deadline": "30 Nov 2026",
                "description": "Scholarship awarded to meritorious students from notification minority communities pursuing graduation or post-graduation level technical and professional degree programs.",
                "version": "v2.0",
                "rules": {
                    "min_marks": 55.0,
                    "max_income": 250000.0,
                    "allowed_castes": ["Minority", "OBC", "General"],
                    "allowed_courses": ["Engineering", "Technology", "Medical", "Pharmacy", "Management"],
                    "required_documents": ["Minority Self-Declaration", "Income Certificate", "Academic Marksheet"],
                    "gender_preference": "ANY"
                }
            },
            {
                "title": "AICTE Pragati Scholarship Scheme for Technical Degrees",
                "provider": "All India Council for Technical Education (AICTE)",
                "category": "Technical Education",
                "amount_display": "₹50,000 / year for Tuition & Books",
                "amount_value": 50000.0,
                "deadline": "31 Dec 2026",
                "description": "Flagship empowerment scheme providing financial assistance to female students admitted to technical degree programmes in AICTE-approved institutions.",
                "version": "v1.1",
                "rules": {
                    "min_marks": 60.0,
                    "max_income": 800000.0,
                    "allowed_castes": ["ALL"],
                    "allowed_courses": ["B.Tech", "BE", "B.Arch", "B.Pharm"],
                    "required_documents": ["Admission Letter", "Income Certificate", "Higher Secondary Marksheet"],
                    "gender_preference": "FEMALE"
                }
            },
            {
                "title": "National Means-cum-Merit Scholarship Scheme (NMMSS)",
                "provider": "Department of School Education & Literacy",
                "category": "Pre-Matric & Secondary",
                "amount_display": "₹12,000 / year (₹1,000 / month)",
                "amount_value": 12000.0,
                "deadline": "25 Oct 2026",
                "description": "Targeted incentive scholarship awarded to meritorious secondary school candidates from economically weaker sections to reduce drop-out rates at class VIII stage.",
                "version": "v1.0",
                "rules": {
                    "min_marks": 55.0,
                    "max_income": 350000.0,
                    "allowed_castes": ["ALL"],
                    "allowed_courses": ["ALL"],
                    "required_documents": ["Income Certificate", "Class 8 Scorecard", "Aadhaar Card"],
                    "gender_preference": "ANY"
                }
            },
            {
                "title": "Ishan Uday Special Scholarship for North Eastern Region",
                "provider": "University Grants Commission (UGC)",
                "category": "Special Assistance",
                "amount_display": "₹7,800 / month for Professional Programs",
                "amount_value": 93600.0,
                "deadline": "10 Dec 2026",
                "description": "Special initiative scheme for youth from North Eastern States pursuing general degree, technical, and professional courses at undergraduate levels across recognized Indian universities.",
                "version": "v1.3",
                "rules": {
                    "min_marks": 60.0,
                    "max_income": 450000.0,
                    "allowed_castes": ["ALL"],
                    "allowed_courses": ["Engineering", "Medical", "Architecture", "Science"],
                    "required_documents": ["Domicile Certificate", "Income Certificate", "Bonafide Student Certificate"],
                    "gender_preference": "ANY"
                }
            }
        ]

        created_scholarships = []
        for s_data in scholarships_data:
            rules_info = s_data.pop("rules")
            s = Scholarship(**s_data)
            db.add(s)
            db.commit()
            db.refresh(s)
            created_scholarships.append(s)

            r = ScholarshipRule(
                scholarship_id=s.id,
                min_marks=rules_info["min_marks"],
                max_income=rules_info["max_income"],
                allowed_castes=json.dumps(rules_info["allowed_castes"]),
                allowed_courses=json.dumps(rules_info["allowed_courses"]),
                required_documents=json.dumps(rules_info["required_documents"]),
                gender_preference=rules_info["gender_preference"],
                rule_version="1.0",
                last_modified_by="Directorate of Scholarships"
            )
            db.add(r)
            db.commit()

        # 3. Sample Documents with Realistic OCR confidence
        doc1 = Document(
            user_id=student_user.id,
            document_type="Income Certificate",
            original_filename="income_cert_2025_revenue.pdf",
            stored_path="uploads/seed_income_cert.pdf",
            file_size=245800,
            ocr_status="Verified",
            ocr_confidence=96.4,
            extracted_data=json.dumps({
                "document_category": "Income Certificate",
                "beneficiary_name": "Rahul Verma",
                "document_serial_no": "REV/DEL/2025/48921",
                "annual_income_certified": "₹1,80,000",
                "issuing_authority": "Office of Tehsildar & Sub-Divisional Magistrate",
                "issue_date": "14-04-2025",
                "tehsildar_seal": "Valid Digital Hash verified"
            }),
            verification_status="Verified",
            verified_by="Automated OCR Engine",
            verification_notes="Automatic verification passed. OCR Confidence 96.4% meets high confidence criteria."
        )
        db.add(doc1)

        doc2 = Document(
            user_id=student_user.id,
            document_type="Community/Caste Certificate",
            original_filename="caste_certificate_bc.pdf",
            stored_path="uploads/seed_caste_cert.pdf",
            file_size=182400,
            ocr_status="Verified",
            ocr_confidence=94.8,
            extracted_data=json.dumps({
                "document_category": "Community/Caste Certificate",
                "beneficiary_name": "Rahul Verma",
                "document_serial_no": "CST/REV/2024/11094",
                "caste_category": "OBC",
                "community_subcaste": "Backward Class (BC-C)",
                "issuing_authority": "District Revenue Officer",
                "issue_date": "22-09-2024"
            }),
            verification_status="Verified",
            verified_by="Automated OCR Engine",
            verification_notes="OCR Confidence 94.8%. Subcaste and category verified against State Gazetted List."
        )
        db.add(doc2)

        # A document requiring manual verification (lower confidence e.g. 61.5%)
        doc3 = Document(
            user_id=student_user.id,
            document_type="Academic Certificate",
            original_filename="qualifying_marksheet_scan.jpg",
            stored_path="uploads/seed_marksheet.jpg",
            file_size=312000,
            ocr_status="Needs Review",
            ocr_confidence=61.5,
            extracted_data=json.dumps({
                "document_category": "Academic Certificate",
                "beneficiary_name": "Rahul Verma",
                "examination_board": "State Board of Technical Education",
                "percentage_marks": "84.5%",
                "scan_quality": "Moderate blur detected on bottom grade table"
            }),
            verification_status="Needs Review",
            verification_notes="OCR Confidence (61.5%) is below automated threshold. Escalated to verification officer queue for seal and roll check."
        )
        db.add(doc3)
        db.commit()

        # 4. Sample Applications
        app1 = Application(
            application_number="SL-2026-894102",
            user_id=student_user.id,
            scholarship_id=created_scholarships[0].id,
            status="Under Verification",
            current_stage="verify", # discover -> understand -> apply -> verify -> track
            verification_notes="Academic scorecard scan is queued for verifier check. Income and Community documents verified."
        )
        db.add(app1)

        app2 = Application(
            application_number="SL-2026-641920",
            user_id=student_user.id,
            scholarship_id=created_scholarships[1].id,
            status="Submitted",
            current_stage="apply",
            verification_notes="Application submitted successfully. Awaiting document validation schedule."
        )
        db.add(app2)

        # 5. Audit Log
        audit = AuditLog(
            user_id=student_user.id,
            action="PROFILE_REGISTRATION",
            target_type="StudentProfile",
            target_id=str(student_profile.id),
            details="Student Rahul Verma registered with CAN-2025-98241. Initialized Google Sheet synchronization."
        )
        db.add(audit)
        db.commit()

        print("Database seed completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
