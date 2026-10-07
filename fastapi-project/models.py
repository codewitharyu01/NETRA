from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    project_name = Column(String, nullable=False)

    project_id = Column(String, unique=True, nullable=False)

    department = Column(String)

    location = Column(String)

    contractor = Column(String)

    contractor_id = Column(
    Integer,
    ForeignKey("contractors.id")
)

    approved_budget = Column(Float)

    progress = Column(Float, default=0)

    status = Column(String, default="Ongoing")

    start_date = Column(Date)

    expected_end_date = Column(Date)

class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True, index=True)

    contractor_name = Column(String, nullable=False)

    registration_number = Column(String, unique=True, nullable=False)

    company_type = Column(String)

    contact_person = Column(String)

    phone = Column(String)

    email = Column(String)

    address = Column(String)

    total_projects = Column(Integer, default=0)

    status = Column(String, default="Active")    

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    officer_name = Column(String, nullable=False)

    inspection_date = Column(Date, nullable=False)

    work_progress = Column(Float)

    quality_status = Column(String)

    remarks = Column(String)

    evidence_url = Column(String)

    status = Column(String, default="Completed")    

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    payment_date = Column(Date, nullable=False)

    amount = Column(Float, nullable=False)

    payment_type = Column(String)

    payment_reference = Column(String, unique=True)

    paid_to = Column(String)

    status = Column(String, default="Completed")

    remarks = Column(String)

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    material_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

    supplier_name = Column(String)
    unit_cost = Column(Float)
    total_cost = Column(Float)

    delivery_date = Column(Date)
    status = Column(String, default="Received")
    remarks = Column(String)

class Labour(Base):
    __tablename__ = "labour"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    worker_name = Column(String, nullable=False)
    worker_type = Column(String, nullable=False)
    number_of_workers = Column(Integer, default=1)

    daily_wage = Column(Float)
    work_days = Column(Integer)

    total_cost = Column(Float)

    start_date = Column(Date)
    end_date = Column(Date)

    status = Column(String, default="Active")
    remarks = Column(String)

class ProgressUpdate(Base):
    __tablename__ = "progress_updates"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    update_date = Column(Date, nullable=False)
    progress_percentage = Column(Float, nullable=False)

    work_stage = Column(String)
    remarks = Column(String)

    updated_by = Column(String)

class ProjectDocument(Base):
    __tablename__ = "project_documents"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    document_name = Column(String, nullable=False)
    document_type = Column(String, nullable=False)

    document_url = Column(String, nullable=False)

    uploaded_by = Column(String)
    upload_date = Column(Date)

    description = Column(String)
    status = Column(String, default="Active")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        String,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    complaint_number = Column(String, unique=True, nullable=False)

    complainant_name = Column(String, nullable=False)
    complainant_contact = Column(String)

    complaint_title = Column(String, nullable=False)
    complaint_description = Column(String, nullable=False)

    complaint_date = Column(Date)

    priority = Column(String, default="Medium")

    status = Column(String, default="Pending")

    assigned_officer = Column(String)

    resolution = Column(String)

    resolved_date = Column(Date)

    evidence_url = Column(String)

    remarks = Column(String)

class Officer(Base):
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    password_hash = Column(String, nullable=False)

    role = Column(String, default="Officer")

    department = Column(String)

    employee_id = Column(String, unique=True, nullable=False)

    status = Column(String, default="Active")                            