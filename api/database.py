import datetime
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./exoplanets.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DatasetDB(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    source = Column(String)  # Kepler / TESS / Uploaded
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)
    data_points = Column(Integer)
    status = Column(String)  # Preprocessed / Raw

class PredictionDB(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer)
    candidate_name = Column(String)
    exoplanet_probability = Column(Float)
    uncertainty = Column(Float)
    reliability = Column(String)
    estimated_depth = Column(Float)
    estimated_duration = Column(Float)
    estimated_period = Column(Float)
    noise_level = Column(String)
    verdict = Column(String)  # Candidate / Rejected (Glitch) / Rejected (EB) / Rejected (Variable)
    reason = Column(Text)
    raw_flux = Column(JSON)  # List of floats
    denoised_flux = Column(JSON)  # List of floats
    attention_map = Column(JSON)  # List of floats
    gradcam_heatmap = Column(JSON)  # List of floats
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ExperimentDB(Base):
    __tablename__ = "experiments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    epochs = Column(Integer)
    batch_size = Column(Integer)
    learning_rate = Column(Float)
    optimizer = Column(String)
    notes = Column(Text)
    best_hpo_params = Column(JSON)
    status = Column(String)  # Running / Completed / Failed
    train_loss = Column(JSON)  # List of floats
    train_acc = Column(JSON)
    val_loss = Column(JSON)
    val_acc = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

