# lousher

Wine e-commerce. Backend written in Python 3, with Django REST Framework. Frontend written in Typescript, using Angular.

## `backend` folder

Install `virtualenv` using pip:

`pip3 install virtualenv`

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

`python manage.py runserver`

## `lousher` (frontend) folder

Install packages:

`npm install`

Then:

`ng serve --open`

## `admin` folder

For generating `js` and `css` files, run:

`npm run build`

after installing npm packages.