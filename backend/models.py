# models.py

# We need the db object from our main app to define the models
from app import db

# The "FOUNDED_BY" Edge (Founder -> StartUp)
# This is a "join table" because a company can have many founders
# and a founder can have many companies.
founders_to_companies = db.Table('founders_to_companies',
    db.Column('founder_id', db.Integer, db.ForeignKey('founders.id'), primary_key=True),
    db.Column('company_id', db.Integer, db.ForeignKey('companies.id'), primary_key=True)
)

# StartUp Node
class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, nullable=False)
    country = db.Column(db.String(100))
    problem_statement = db.Column(db.Text)
    business_model = db.Column(db.String(256))
    industry = db.Column(db.String(100))
    # This defines the relationship to funding rounds
    funding_rounds = db.relationship('FundingRound', backref='company', lazy=True)
    # This defines the relationship to founders via our join table
    founders = db.relationship('Founder', secondary=founders_to_companies, lazy='subquery',
        backref=db.backref('companies', lazy=True))

# VC Node
class Investor(db.Model):
    __tablename__ = 'investors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, nullable=False)
    # This defines the relationship to funding rounds
    funding_rounds = db.relationship('FundingRound', backref='investor', lazy=True)

# Founder Node
class Founder(db.Model):
    __tablename__ = 'founders'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)

# The "Investment" Edge (VC -> StartUp)
class FundingRound(db.Model):
    __tablename__ = 'funding_rounds'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    investor_id = db.Column(db.Integer, db.ForeignKey('investors.id'), nullable=False)
    amount_usd = db.Column(db.Integer)
    stage = db.Column(db.String(50))
    # announced_at = db.Column(db.DateTime) # Optional: if you have date data
