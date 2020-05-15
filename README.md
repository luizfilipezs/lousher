# lousher

Wine e-commerce. Backend written in Python 3, with Django REST Framework. Frontend written in Typescript, using Angular.

## `backend` folder

Run migrations:

```bash
source env/bin/activate

python manage.py makemigrations
python manage.py migrate
```

Then:

```bash
python manage.py runserver
```

## `lousher` (frontend) folder

Install packages:

```bash
npm install
```

Then:
```bash
ng serve --open
```