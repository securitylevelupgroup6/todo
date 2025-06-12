ALTER TABLE todo_history
DROP CONSTRAINT todo_history_todo_id_fkey;

ALTER TABLE todo_history
ADD CONSTRAINT todo_history_todo_id_fkey
FOREIGN KEY (todo_id)
REFERENCES todos(id)
ON DELETE CASCADE;
