# lousher

Wine e-commerce. Backend written in Python 3, with Django REST Framework. Frontend written in Typescript, using Angular.

## `backend` folder

Install `virtualenv` using pip:

```bash
pip3 install virtualenv
```

Create virtual environment and install packages:

```bash
virtualenv env
source env/bin/activate
pip install -r requirements.txt
```

Run migrations:

```bash
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