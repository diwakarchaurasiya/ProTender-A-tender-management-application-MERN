/*
  # Sample Data for ProTender

  1. Sample Companies
    - TechCorp Solutions (Technology)
    - BuildRight Construction (Construction)
    - GreenEnergy Systems (Renewable Energy)
    - DataFlow Analytics (Data Analytics)
    - CloudFirst Technologies (Cloud Services)

  2. Sample Tenders
    - Various tenders from different companies
    - Different budgets and deadlines
    - Active status

  3. Sample Goods & Services
    - Services offered by each company
*/

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (id, email, hashed_password, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@techcorp.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'company'),
  ('550e8400-e29b-41d4-a716-446655440002', 'contact@buildright.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'company'),
  ('550e8400-e29b-41d4-a716-446655440003', 'info@greenenergy.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'company'),
  ('550e8400-e29b-41d4-a716-446655440004', 'hello@dataflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'company'),
  ('550e8400-e29b-41d4-a716-446655440005', 'team@cloudfirst.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'company');

-- Insert sample companies
INSERT INTO companies (id, user_id, name, industry, description, logo_url) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Technology', 'Leading provider of enterprise software solutions and digital transformation services. We specialize in custom software development, cloud migration, and IT consulting.', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'BuildRight Construction', 'Construction', 'Premier construction company with over 20 years of experience in commercial and residential projects. We deliver quality construction services on time and within budget.', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'GreenEnergy Systems', 'Renewable Energy', 'Innovative renewable energy solutions provider specializing in solar, wind, and energy storage systems. Committed to sustainable energy for a better future.', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'DataFlow Analytics', 'Data Analytics', 'Advanced data analytics and business intelligence solutions. We help organizations make data-driven decisions through cutting-edge analytics and machine learning.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'CloudFirst Technologies', 'Cloud Services', 'Cloud infrastructure and DevOps specialists. We provide comprehensive cloud solutions including migration, optimization, and managed services for businesses of all sizes.', 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop');

-- Insert sample tenders
INSERT INTO tenders (id, company_id, title, description, deadline, budget, status) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Enterprise CRM System Development', 'We are seeking a qualified software development company to build a comprehensive Customer Relationship Management (CRM) system. The system should include lead management, sales pipeline tracking, customer communication tools, and detailed analytics dashboard. Integration with existing systems is required.', '2024-03-15', 150000.00, 'active'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Office Complex Construction Project', 'Construction of a modern 5-story office complex with underground parking. The project includes architectural design, structural engineering, MEP systems, and interior finishing. LEED certification is preferred. Total area: 50,000 sq ft.', '2024-04-20', 2500000.00, 'active'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Solar Panel Installation for Manufacturing Facility', 'Installation of a 2MW solar panel system for our manufacturing facility. Includes design, procurement, installation, and commissioning. System should integrate with existing electrical infrastructure and include monitoring capabilities.', '2024-03-30', 800000.00, 'active'),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Data Warehouse Migration to Cloud', 'Migration of our on-premises data warehouse to a cloud-based solution. Includes data migration, ETL pipeline setup, security implementation, and staff training. Experience with AWS/Azure required.', '2024-04-10', 200000.00, 'active'),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'DevOps Infrastructure Setup', 'Complete DevOps infrastructure setup including CI/CD pipelines, containerization, monitoring, and automated deployment. Should support microservices architecture and include disaster recovery planning.', '2024-03-25', 120000.00, 'active'),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 'Mobile App Development for E-commerce', 'Development of a cross-platform mobile application for our e-commerce platform. Features include product catalog, shopping cart, payment integration, user profiles, and push notifications. iOS and Android support required.', '2024-05-01', 180000.00, 'active');

-- Insert sample goods and services
INSERT INTO goods_services (company_id, title, description) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Custom Software Development', 'Full-stack web and mobile application development using modern technologies'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Cloud Migration Services', 'Complete cloud migration and optimization services for AWS, Azure, and GCP'),
  ('660e8400-e29b-41d4-a716-446655440001', 'IT Consulting', 'Strategic IT consulting and digital transformation advisory services'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Commercial Construction', 'Office buildings, retail spaces, and industrial facility construction'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Residential Construction', 'Custom homes, apartments, and residential complex development'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Project Management', 'End-to-end construction project management and coordination'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Solar Panel Installation', 'Residential and commercial solar panel system design and installation'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Wind Energy Solutions', 'Wind turbine installation and maintenance services'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Energy Storage Systems', 'Battery storage solutions for renewable energy systems'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Business Intelligence', 'Custom BI dashboards and reporting solutions'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Data Science Consulting', 'Machine learning and predictive analytics services'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Data Visualization', 'Interactive data visualization and dashboard development'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Cloud Infrastructure', 'Cloud architecture design and implementation'),
  ('660e8400-e29b-41d4-a716-446655440005', 'DevOps Services', 'CI/CD pipeline setup and automation services'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Managed Cloud Services', '24/7 cloud infrastructure monitoring and management');

-- Insert sample applications
INSERT INTO applications (tender_id, applicant_company_id, proposal, status) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 'We propose to develop a comprehensive CRM system using React.js frontend and Node.js backend with PostgreSQL database. Our solution will include advanced analytics, real-time notifications, and seamless integration capabilities. Timeline: 6 months.', 'pending'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Our construction team can deliver this office complex project with sustainable building practices and renewable energy integration. We propose LEED Gold certification with solar panel installation. Timeline: 18 months.', 'pending'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'We can provide a complete 2MW solar installation with high-efficiency panels and advanced monitoring systems. Our solution includes 25-year warranty and maintenance services. Timeline: 4 months.', 'accepted'),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', 'Our cloud migration approach includes comprehensive data assessment, zero-downtime migration strategy, and post-migration optimization. We specialize in AWS data services and can ensure seamless transition. Timeline: 3 months.', 'pending');