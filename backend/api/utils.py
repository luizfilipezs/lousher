import calendar, json, string, random, inspect
from datetime import date
from decimal import Decimal
from unicodedata import normalize
from typing import Tuple, Callable


## TYPES

Number = float or int or Decimal

## DATAS

def lista_datas(data_inicial: date, data_final: date) -> date:
    atual = data_inicial
    while atual <= data_final:
        atual = atual.replace(day=calendar.monthrange(atual.year, atual.month)[1])
        if atual.month >= 12:
            proxima = date(atual.year + 1, 1, 1)
        else:
            proxima = date(atual.year, atual.month + 1, 1)
        yield atual
        atual = proxima

def calcula_anos(data_inicial: date, data_final: date) -> int:
    d, a = (data_inicial - data_final).days, 0
    while(d >= 365):
        a += 1
        d -= 365
    return a

def numero_para_mes(n: int, comeca_com_zero=False) -> str:
    return ('Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro')[n - (0 if comeca_com_zero else 1)]

## NÚMEROS

def divisao_zero(n: Number, d: Number) -> Number:
    return n / d if d else 0

def verifica_zero(n: Number or str, retira=False) -> str:
    n = str(n)
    if int(n) < 10:
        n = '0' + n if len(n) < 2 and retira is False else n[0:]
    return n

## STRINGS

def random_string(comprimento: int) -> str:
    return ''.join(random.choice(string.ascii_letters) for i in range(comprimento))

def remove_acentos(txt: str) -> str:
    return normalize('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')

def formatar_valor_financeiro(float_number: float) -> str:
    # Insere vírgulas a cada três casas de números inteiros (ex.: 3000000.00 => 3,000,000.00)
    count_valor = str(round(float(float_number), 2))
    if count_valor.endswith('.0'):
        count_valor += '0'
    s = count_valor[:-3]
    new_string, i, j = '', len(s), 0
    while(j < i):
        new_string += s[j]
        if ((i - j - 1) / 3).is_integer() and not j == i - 1:
            new_string += ','
        j += 1
    return new_string + count_valor[i:]

## CONVERSÕES

def objeto_para_dicionario(obj: object, customTypes: Tuple[object]) -> dict:
    # Transforma em dicionários o objeto e todas as entradas que também são objetos dos tipos definidos em customTypes
    obj = obj.__dict__
    for prop in obj:
        if isinstance(obj[prop], customTypes):
            obj[prop] = objeto_para_dicionario(obj[prop], customTypes)
        elif isinstance(obj[prop], list):
            for i in range(len(obj[prop])):
                if isinstance(obj[prop][i], customTypes):
                    obj[prop][i] = objeto_para_dicionario(obj[prop][i], customTypes)
    return obj

def gerar_json(dicionario: dict) -> str:
    return json.dumps(dicionario, indent=2, sort_keys=True, ensure_ascii=False)

def read_request_body(request) -> dict:
    content, values = {}, request.body.decode('utf-8').split('=')
    for i in range(len(values) - 1):
        content[values[i]] = values[i+1]
        i += 2
    return content

def get_class_that_defined_method(meth: Callable) -> object:
    if inspect.ismethod(meth):
        for cls in inspect.getmro(meth.__self__.__class__):
            if cls.__dict__.get(meth.__name__) is meth:
                return cls
        meth = meth.__func__
    if inspect.isfunction(meth):
        cls = getattr(inspect.getmodule(meth),
                      meth.__qualname__.split('.<locals>', 1)[0].rsplit('.', 1)[0])
        if isinstance(cls, type):
            return cls
    return None