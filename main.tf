# ==========================================
# 1. CONFIGURATION INITIALE
# ==========================================
provider "aws" {
  region = "eu-west-3" # Paris (faible latence)
}

variable "db_password" {
  description = "Mot de passe de la base de donnees PostgreSQL (8 caracteres minimum)"
  type        = string
  sensitive   = true

  # NOUVEAU : Bloc de validation
  # Utilité : Bloque l'exécution immédiatement si le mot de passe est trop court.
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Erreur : Le mot de passe de la base de données doit contenir au minimum 8 caractères."
  }
}

# ==========================================
# 2. GROUPES DE SÉCURITÉ (PARE-FEU)
# ==========================================

resource "aws_security_group" "meme_sg" {
  name        = "meme-generator-sg"
  description = "Autoriser le trafic Web et SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] 
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "meme-rds-sg"
  description = "Autoriser acces uniquement depuis le serveur EC2"

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.meme_sg.id] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==========================================
# 3. RESSOURCES CLOUD (EC2 & RDS)
# ==========================================

resource "aws_instance" "meme_server" {
  ami           = "ami-02aabe2c1c59b6feb" 
  instance_type = "t3.micro"              
  
  vpc_security_group_ids = [aws_security_group.meme_sg.id]
  key_name               = "meme-generator-key" 

  user_data = <<-EOF
              #!/bin/bash
              
              DOMAIN="noxmeme.duckdns.org" 
              TOKEN="2c603da2-e5fd-4478-9423-ca242c0af260"
              
              # Mise à jour IP sur DuckDNS
              curl "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="

              # Installation des dépendances
              apt-get update -y
              apt-get install -y nginx python3 python3-pip certbot python3-certbot-nginx
              EOF

  tags = {
    Name = "Serveur-Meme-Generator"
  }
}

resource "aws_db_instance" "meme_db" {
  identifier           = "meme-database"
  engine               = "postgres"
  engine_version       = "15"               
  instance_class       = "db.t3.micro"        
  allocated_storage    = 20                   
  
  db_name              = "memedb"
  username             = "memeadmin"
  password             = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  
  publicly_accessible  = false 
  skip_final_snapshot  = true 
}

# ==========================================
# 4. OUTPUTS (AFFICHAGE)
# ==========================================

output "instance_public_ip" {
  value = aws_instance.meme_server.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.meme_db.endpoint
}