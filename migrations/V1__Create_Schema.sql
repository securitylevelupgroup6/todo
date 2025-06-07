CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE, 
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  two_factor_secret VARCHAR(255) 
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ  NOT NULL,
  revoked boolean NOT NULL
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  lead_user_id INT NOT NULL
);

CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  team_id INT NOT NULL,
  CONSTRAINT uq_team_member UNIQUE (user_id, team_id)
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE 
);

CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  CONSTRAINT uq_user_role UNIQUE (user_id, role_id)
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  current_state_id INT NOT NULL, 
  team_owner_member_id INT NOT NULL 
);

CREATE TABLE todo_statuses (
  id SERIAL PRIMARY KEY,
  status_name VARCHAR(255) NOT NULL UNIQUE 
);

CREATE TABLE todo_history (
  id SERIAL PRIMARY KEY,
  todo_id INT NOT NULL,
  old_state_id INT NOT NULL, 
  updated_state_id INT NOT NULL, 
  reporter_member_id INT NOT NULL, 
  change_date TIMESTAMPTZ NOT NULL,
);

CREATE TABLE todo_states (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL, 
  status_id INT NOT NULL, 
  team_id INT NOT NULL,
  assignee_member_id INT NULL 
);

ALTER TABLE refresh_tokens ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE teams ADD FOREIGN KEY (lead_user_id) REFERENCES users (id);

ALTER TABLE team_members ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE team_members ADD FOREIGN KEY (team_id) REFERENCES teams (id);

ALTER TABLE user_roles ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_roles ADD FOREIGN KEY (role_id) REFERENCES roles (id);

ALTER TABLE todos ADD FOREIGN KEY (current_state_id) REFERENCES todo_states (id);
ALTER TABLE todos ADD FOREIGN KEY (team_owner_member_id) REFERENCES team_members (id);

ALTER TABLE todo_history ADD FOREIGN KEY (todo_id) REFERENCES todos (id);
ALTER TABLE todo_history ADD FOREIGN KEY (old_state_id) REFERENCES todo_states (id);
ALTER TABLE todo_history ADD FOREIGN KEY (reporter_member_id) REFERENCES team_members (id);

ALTER TABLE todo_states ADD FOREIGN KEY (status_id) REFERENCES todo_statuses (id);
ALTER TABLE todo_states ADD FOREIGN KEY (assignee_member_id) REFERENCES team_members (id);
ALTER TABLE todo_states ADD FOREIGN KEY (team_id) REFERENCES teams (id);
