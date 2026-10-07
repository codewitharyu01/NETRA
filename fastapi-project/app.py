import bcrypt
from jose import jwt
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, Base, get_db
import models
from fastapi import FastAPI, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials



SECRET_KEY = "NETRA_SECRET_KEY_CHANGE_LATER"
ALGORITHM = "HS256"

security = HTTPBearer()

app = FastAPI(
    title="NETRA Government Transparency API",
    description="Backend API for Government Construction Monitoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {
        "message": "NETRA API is running"
    }

def get_current_officer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        officer_id = payload.get("sub")

        if officer_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    officer = db.query(models.Officer).filter(
        models.Officer.id == int(officer_id)
    ).first()

    if officer is None:
        raise HTTPException(
            status_code=401,
            detail="Officer not found"
        )

    if officer.status != "Active":
        raise HTTPException(
            status_code=403,
            detail="Officer account is inactive"
        )

    return officer

def require_roles(*allowed_roles):
    def role_checker(
        current_officer: models.Officer = Depends(get_current_officer)
    ):
        if current_officer.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource"
            )

        return current_officer

    return role_checker

# Get logged-in officer profile
@app.get("/me")
def get_my_profile(
    current_officer: models.Officer = Depends(get_current_officer)
):
    return {
        "id": current_officer.id,
        "name": current_officer.full_name,
        "email": current_officer.email,
        "role": current_officer.role,
        "department": current_officer.department,
        "employee_id": current_officer.employee_id
    }

@app.get("/admin/test")
def admin_test(
    current_officer: models.Officer = Depends(
        require_roles("Admin")
    )
):
    return {
        "message": "Admin access granted",
        "officer": current_officer.full_name,
        "role": current_officer.role
    }


# Get all projects
@app.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
        require_roles("Admin", "Officer", "Inspector")
    )
):
    projects = db.query(models.Project).all()
    return projects


# Create a project
@app.post("/projects")
def create_project(
    project_name: str,
    project_id: str,
    department: str,
    location: str,
    contractor: str,
    approved_budget: float,
    progress: float = 0,
    status: str = "Ongoing",
    db: Session = Depends(get_db)
):

    new_project = models.Project(
        project_name=project_name,
        project_id=project_id,
        department=department,
        location=location,
        contractor=contractor,
        approved_budget=approved_budget,
        progress=progress,
        status=status
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


# Get single project
@app.get("/projects/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):

    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {
            "message": "Project not found"
        }

    return project


# Update project
@app.put("/projects/{project_id}")
def update_project(
    project_id: str,
    project_name: str,
    department: str,
    location: str,
    contractor: str,
    approved_budget: float,
    progress: float,
    status: str,
    db: Session = Depends(get_db)
):

    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {
            "message": "Project not found"
        }

    project.project_name = project_name
    project.department = department
    project.location = location
    project.contractor = contractor
    project.approved_budget = approved_budget
    project.progress = progress
    project.status = status

    db.commit()
    db.refresh(project)

    return project
    
# Delete project
@app.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    db: Session = Depends(get_db)
    
):

    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {
            "message": "Project not found"
        }

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully",
        "project_id": project_id
    }

# Dashboard statistics
@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):

    total_projects = db.query(models.Project).count()

    ongoing_projects = db.query(models.Project).filter(
        models.Project.status == "Ongoing"
    ).count()

    completed_projects = db.query(models.Project).filter(
        models.Project.status == "Completed"
    ).count()

    total_budget = db.query(
        func.sum(models.Project.approved_budget)
    ).scalar() or 0

    average_progress = db.query(
        func.avg(models.Project.progress)
    ).scalar() or 0

    return {
        "total_projects": total_projects,
        "ongoing_projects": ongoing_projects,
        "completed_projects": completed_projects,
        "total_approved_budget": total_budget,
        "average_progress": round(average_progress, 2)
    }

# Create contractor
@app.post("/contractors")
def create_contractor(
    contractor_name: str,
    registration_number: str,
    company_type: str,
    contact_person: str,
    phone: str,
    email: str,
    address: str,
    db: Session = Depends(get_db)
):

    new_contractor = models.Contractor(
        contractor_name=contractor_name,
        registration_number=registration_number,
        company_type=company_type,
        contact_person=contact_person,
        phone=phone,
        email=email,
        address=address
    )

    db.add(new_contractor)
    db.commit()
    db.refresh(new_contractor)

    return new_contractor

# Get all contractors
@app.get("/contractors")
def get_contractors(db: Session = Depends(get_db)):

    contractors = db.query(models.Contractor).all()

    return contractors

# Create inspection
@app.post("/inspections")
def create_inspection(
    project_id: str,
    officer_name: str,
    inspection_date: str,
    work_progress: float,
    quality_status: str,
    remarks: str,
    evidence_url: str = "",
    status: str = "Completed",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector")
)
):

    new_inspection = models.Inspection(
        project_id=project_id,
        officer_name=officer_name,
        inspection_date=inspection_date,
        work_progress=work_progress,
        quality_status=quality_status,
        remarks=remarks,
        evidence_url=evidence_url,
        status=status
    )

    db.add(new_inspection)
    db.commit()
    db.refresh(new_inspection)

    return new_inspection

# Get all inspections
@app.get("/inspections")
def get_inspections(db: Session = Depends(get_db)):

    inspections = db.query(models.Inspection).all()

    return inspections

# Create payment
@app.post("/payments")
def create_payment(
    project_id: str,
    payment_date: str,
    amount: float,
    payment_type: str,
    payment_reference: str,
    paid_to: str,
    status: str = "Completed",
    remarks: str = "",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Finance Officer")
)
):

    new_payment = models.Payment(
        project_id=project_id,
        payment_date=payment_date,
        amount=amount,
        payment_type=payment_type,
        payment_reference=payment_reference,
        paid_to=paid_to,
        status=status,
        remarks=remarks
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment
# Get all payments
@app.get("/payments")
def get_payments(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(get_current_officer),
    role_check: models.Officer = Depends(
        require_roles("Admin", "Finance Officer")
    )
):
    payments = db.query(models.Payment).all()
    return payments

@app.get("/projects/{project_id}/financial-summary")
def get_financial_summary(
    project_id: str,
    db: Session = Depends(get_db)
):
    # Project find karo
    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {"message": "Project not found"}

    # Project ke saare payments ka total
    total_paid = db.query(
        func.sum(models.Payment.amount)
    ).filter(
        models.Payment.project_id == project_id
    ).scalar() or 0

    # Remaining budget
    remaining_budget = project.approved_budget - total_paid

    # Payment percentage
    if project.approved_budget > 0:
        payment_percentage = (
            total_paid / project.approved_budget
        ) * 100
    else:
        payment_percentage = 0

    return {
        "project_id": project.project_id,
        "project_name": project.project_name,
        "approved_budget": project.approved_budget,
        "total_paid": total_paid,
        "remaining_budget": remaining_budget,
        "payment_percentage": round(payment_percentage, 2)
    }

@app.post("/materials")
def create_material(
    project_id: str,
    material_name: str,
    quantity: float,
    unit: str,
    supplier_name: str,
    unit_cost: float,
    delivery_date: str,
    status: str = "Received",
    remarks: str = "",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector", "Engineer")
)
):
    total_cost = quantity * unit_cost

    new_material = models.Material(
        project_id=project_id,
        material_name=material_name,
        quantity=quantity,
        unit=unit,
        supplier_name=supplier_name,
        unit_cost=unit_cost,
        total_cost=total_cost,
        delivery_date=delivery_date,
        status=status,
        remarks=remarks
    )

    db.add(new_material)
    db.commit()
    db.refresh(new_material)

    return new_material

@app.get("/materials")
def get_materials(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(get_current_officer),
    role_check: models.Officer = Depends(
        require_roles("Inspector", "Engineer")
    )
):
    materials = db.query(models.Material).all()
    return materials

@app.get("/projects/{project_id}/materials")
def get_project_materials(
    project_id: str,
    db: Session = Depends(get_db)
):
    materials = db.query(models.Material).filter(
        models.Material.project_id == project_id
    ).all()

    return materials

@app.post("/labour")
def create_labour(
    project_id: str,
    worker_name: str,
    worker_type: str,
    number_of_workers: int,
    daily_wage: float,
    work_days: int,
    start_date: str,
    end_date: str,
    status: str = "Active",
    remarks: str = "",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector", "Engineer")
)
):
    total_cost = number_of_workers * daily_wage * work_days

    new_labour = models.Labour(
        project_id=project_id,
        worker_name=worker_name,
        worker_type=worker_type,
        number_of_workers=number_of_workers,
        daily_wage=daily_wage,
        work_days=work_days,
        total_cost=total_cost,
        start_date=start_date,
        end_date=end_date,
        status=status,
        remarks=remarks
    )

    db.add(new_labour)
    db.commit()
    db.refresh(new_labour)

    return new_labour

@app.get("/labour")
def get_labour(db: Session = Depends(get_db),
               current_officer: models.Officer = Depends(
        require_roles("Inspector", "Engineer")
    )):
    labour = db.query(models.Labour).all()
    return labour

@app.get("/projects/{project_id}/labour")
def get_project_labour(
    project_id: str,
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector", "Engineer")
)
):
    labour = db.query(models.Labour).filter(
        models.Labour.project_id == project_id
    ).all()

    return labour

@app.post("/progress-updates")
def create_progress_update(
    project_id: str,
    update_date: str,
    progress_percentage: float,
    work_stage: str,
    remarks: str,
    updated_by: str,
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector", "Engineer")
)
):
    # Project check karo
    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {"message": "Project not found"}

    new_update = models.ProgressUpdate(
        project_id=project_id,
        update_date=update_date,
        progress_percentage=progress_percentage,
        work_stage=work_stage,
        remarks=remarks,
        updated_by=updated_by
    )

    db.add(new_update)

    # Project ki current progress bhi update karo
    project.progress = progress_percentage

    db.commit()
    db.refresh(new_update)

    return new_update

@app.get("/progress-updates")
def get_progress_updates(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector", "Engineer")
)
):
    updates = db.query(models.ProgressUpdate).all()
    return updates

@app.get("/projects/{project_id}/progress-history")
def get_progress_history(
    project_id: str,
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Inspector", "Engineer")
)
):
    updates = db.query(models.ProgressUpdate).filter(
        models.ProgressUpdate.project_id == project_id
    ).order_by(
        models.ProgressUpdate.update_date
    ).all()

    return updates

@app.post("/documents")
def create_document(
    project_id: str,
    document_name: str,
    document_type: str,
    document_url: str,
    uploaded_by: str,
    upload_date: str,
    description: str = "",
    status: str = "Active",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Engineer")
)
):
    # Project check
    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {"message": "Project not found"}

    new_document = models.ProjectDocument(
        project_id=project_id,
        document_name=document_name,
        document_type=document_type,
        document_url=document_url,
        uploaded_by=uploaded_by,
        upload_date=upload_date,
        description=description,
        status=status
    )

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return new_document

@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Engineer")
)
):
    documents = db.query(models.ProjectDocument).all()
    return documents

@app.get("/projects/{project_id}/documents")
def get_project_documents(
    project_id: str,
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Engineer")
)
):
    documents = db.query(models.ProjectDocument).filter(
        models.ProjectDocument.project_id == project_id
    ).all()

    return documents

@app.post("/complaints")
def create_complaint(
    project_id: str,
    complaint_number: str,
    complainant_name: str,
    complainant_contact: str,
    complaint_title: str,
    complaint_description: str,
    complaint_date: str,
    priority: str = "Medium",
    status: str = "Pending",
    assigned_officer: str = "",
    evidence_url: str = "",
    remarks: str = "",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Officer")
)
):
    # Check project
    project = db.query(models.Project).filter(
        models.Project.project_id == project_id
    ).first()

    if project is None:
        return {"message": "Project not found"}

    new_complaint = models.Complaint(
        project_id=project_id,
        complaint_number=complaint_number,
        complainant_name=complainant_name,
        complainant_contact=complainant_contact,
        complaint_title=complaint_title,
        complaint_description=complaint_description,
        complaint_date=complaint_date,
        priority=priority,
        status=status,
        assigned_officer=assigned_officer,
        evidence_url=evidence_url,
        remarks=remarks
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return new_complaint

@app.get("/complaints")
def get_complaints(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Officer")
)
):
    complaints = db.query(models.Complaint).all()

    return complaints

@app.get("/projects/{project_id}/complaints")
def get_project_complaints(
    project_id: str,
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Officer")
)
):
    complaints = db.query(models.Complaint).filter(
        models.Complaint.project_id == project_id
    ).all()

    return complaints

@app.put("/complaints/{complaint_number}")
def update_complaint(
    complaint_number: str,
    status: str,
    assigned_officer: str,
    resolution: str = "",
    resolved_date: str = "",
    remarks: str = "",
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
    require_roles("Admin", "Inspector", "Officer")
)
):
    complaint = db.query(models.Complaint).filter(
        models.Complaint.complaint_number == complaint_number
    ).first()

    if complaint is None:
        return {"message": "Complaint not found"}

    complaint.status = status
    complaint.assigned_officer = assigned_officer
    complaint.resolution = resolution
    complaint.resolved_date = resolved_date
    complaint.remarks = remarks

    db.commit()
    db.refresh(complaint)

    return complaint

@app.post("/officers")
def create_officer(
    full_name: str,
    email: str,
    password: str,
    role: str,
    department: str,
    employee_id: str,
    db: Session = Depends(get_db),
        current_officer: models.Officer = Depends(
        require_roles("Admin")
    )
):
    existing_officer = db.query(models.Officer).filter(
        models.Officer.email == email
    ).first()

    if existing_officer:
        return {"message": "Officer with this email already exists"}

    password_hash = bcrypt.hashpw(
    password.encode("utf-8"),
    bcrypt.gensalt()
).decode("utf-8")

    new_officer = models.Officer(
        full_name=full_name,
        email=email,
        password_hash=password_hash,
        role=role,
        department=department,
        employee_id=employee_id
    )

    db.add(new_officer)
    db.commit()
    db.refresh(new_officer)

    return {
        "message": "Officer created successfully",
        "officer_id": new_officer.id,
        "full_name": new_officer.full_name,
        "email": new_officer.email,
        "role": new_officer.role,
        "department": new_officer.department,
        "employee_id": new_officer.employee_id
    }

@app.get("/officers")
def get_officers(
    db: Session = Depends(get_db),
    current_officer: models.Officer = Depends(
        require_roles("Admin")
    )
):
    officers = db.query(models.Officer).all()

    return [
        {
            "id": officer.id,
            "full_name": officer.full_name,
            "email": officer.email,
            "role": officer.role,
            "department": officer.department,
            "employee_id": officer.employee_id,
            "status": officer.status
        }
        for officer in officers
    ]


@app.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    officer = db.query(models.Officer).filter(
        models.Officer.email == email
    ).first()

    if officer is None:
        return {"message": "Invalid email or password"}

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        officer.password_hash.encode("utf-8")
    ):
        return {"message": "Invalid email or password"}

    token_data = {
        "sub": str(officer.id),
        "email": officer.email,
        "role": officer.role
    }

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "officer": {
            "id": officer.id,
            "name": officer.full_name,
            "email": officer.email,
            "role": officer.role,
            "department": officer.department
        }
    }