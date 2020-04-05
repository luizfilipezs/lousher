import os, functools, inspect
from time import time
from .utils import get_class_that_defined_method
from typing import Any, Callable, Dict, List

## Ferramentas o terminal

class _Terminal(object):

    class __Colors:
        HEADER = '\033[95m'
        OKBLUE = '\033[94m'
        OKGREEN = '\033[92m'
        WARNING = '\033[93m'
        FAIL = '\033[91m'
        ENDC = '\033[0m'
        BOLD = '\033[1m'
        UNDERLINE = '\033[4m'

    __count_names: List[Dict] = []

    def __write(self, txt, color=None, bold=True):
        if color is None:
            color = self.__Colors.OKBLUE
        print(f"{self.__Colors.BOLD if bold else ''}{color}{txt}{self.__Colors.ENDC}")

    def log(self, *args):
        for arg in args:
            self.__write(arg)
        if len(args) == 0:
            self.__write('...')

    def warn(self, *args):
        for arg in args:
            self.__write(arg, self.__Colors.WARNING)

    def error(self, *args):
        for arg in args:
            self.__write(arg, self.__Colors.FAIL)

    def clear(self, *args):
        operacional_system = 'unix'
        if len(args):
            operacional_system = args[0]
        if operacional_system == 'unix':
            os.system('clear')
        elif operacional_system == 'win':
            os.system('cls')

    def success(self, *args):
        for arg in args:
            self.__write(arg, self.__Colors.OKGREEN)
        if len(args) == 0:
            self.__write('OK', self.__Colors.OKGREEN)

    def count(self, name: str='contador') -> int:
        i = next((self.__count_names.index(item) for item in self.__count_names if item['name'] == name), None)
        if i is None:
            dictionary = { 'name': name, 'count': 1 }
            self.__count_names.append(dictionary)
        else:
            dictionary = self.__count_names[i]
            dictionary['count'] += 1
            self.__count_names[i] = dictionary
        self.log(f"{dictionary['name']}: {dictionary['count']}")
        return dictionary['count']

    # É semelhante ao comando nativo assert, mas não para o programa, apenas imprime o callback
    def check_bool(self, boolean: bool, callback: Any):
        if not type(boolean) is bool:
            self.error("Terminal.check_bool: o argumento deve ser do tipo bool!")
        elif not boolean is True:
            self.warn(f"Checagem falhou: {callback}")

    def table(self, dictionary_list: List[Dict]):
        if not type(dictionary_list) is list:
            return self.error("Terminal.table: o argumento deve ser uma list de dicionários!")

        keys = []
        for d in dictionary_list:
            if not type(d) is dict:
                continue
            dk = d.keys()
            for k in dk:
                if not k in keys:
                    keys.append(k)

        values = [[] for i in range(len(keys))]
        for d in dictionary_list:
            if not type(d) is dict:
                continue
            for key in keys:
                if key in d:
                    values[keys.index(key)].append(d[key])

        max_blank_space = 15

        def check_length(text) -> str:
            s = str(text)
            if len(s) > max_blank_space - 2:
                s = s[:max_blank_space - 4] + '...'
            return s

        lines, header = [], ''
        for i in range(len(keys)):
            s = check_length(str(keys[i]) + ':')
            r = ''
            for n in range(max_blank_space - len(s)):
                r += ' ' if not n == max_blank_space - len(s) - 1 else f"{self.__Colors.OKBLUE}|{self.__Colors.ENDC}"
            header += f"{self.__Colors.BOLD}{self.__Colors.UNDERLINE}{self.__Colors.OKBLUE}{s}{self.__Colors.ENDC}{r}"
        lines.append(header)

        i = 0
        l = 0 if len(values) == 0 else len(values[0])
        for i in range(l):
            line = ''
            for arr in values:
                s = check_length(arr[i]) if i < len(arr) else '-'
                r = s
                for n in range(max_blank_space - len(s)):
                    r += ' ' if not n == max_blank_space - len(s) - 1 else f"{self.__Colors.OKBLUE}|{self.__Colors.ENDC}"
                line += r
            lines.append(line)

        for line in lines:
            print(line)

terminal = _Terminal()


# Ferramentas para terminal em forma de decorator functions

class DecoratorTools(object):

    @staticmethod
    def log(*args, type='log') -> Callable:
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                try:
                    to_log, cmd = logs, f"terminal.{type}(*logs)"
                    exec(cmd, globals(), locals())
                except AttributeError:
                    terminal.error(f"DecoratorTools.log: Tipo inválido de log utilizado na função {func.__name__}")
                except SyntaxError:
                    terminal.error(f"DecoratorTools.log: Tipo de log provavelmente não especificado na função {func.__name__}")
                response = func(*args, **kwargs)
                return response
            return wrapper
        if len(args) == 1 and callable(args[0]):
            logs = []
            return decorator(args[0])
        logs = args
        return decorator

    @staticmethod
    def count(*args) -> Callable:
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                response = func(*args, **kwargs)
                terminal.count(name)
                return response
            return wrapper
        name = args[0]
        if len(args) == 1 and callable(args[0]):
            name = name.__name__
            return decorator(args[0])
        return decorator

    @staticmethod
    def stopwatch(*args, **kwargs) -> Callable:
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs) -> None:
                ti = time()
                response = func(*args, **kwargs)
                tf = time()
                terminal.warn(f"Tempo de execução de {func.__name__}: {(tf - ti) * multiply}")
                return response
            return wrapper
        if 'get_ms' in kwargs and type(kwargs['get_ms']) is bool:
            multiply = 1 if not kwargs['get_ms'] else 1000
        else:
            multiply = 1
        return decorator(args[0]) if len(args) == 1 and callable(args[0]) else decorator

    @staticmethod
    def override(*args, **kwargs) -> Callable:
        # Determina se uma exceção deve ser lançada ou se deve apenas imprimir um aviso no terminal
        stop_application = kwargs['get_error'] if 'get_error' in kwargs else False
        def decorator(func: Callable) -> Callable:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                def throw_error(msg: str, stop=False):
                    if stop:
                        raise Exception(msg)
                    else:
                        terminal.warn(msg)
                cls = get_class_that_defined_method(func)
                parents = list(inspect.getmro(cls))
                # Remove object e a classe detentora do método de sua lista de parentes
                if cls in parents:
                    parents.remove(cls)
                if object in parents:
                    parents.remove(object)
                # Retorna erro se a classe não for herdada
                if len(parents) == 0:
                    error_msg = f"O método {func.__name__} não pode ser sobrescrito porque {cls.__name__} não é uma classe herdada"
                    throw_error(error_msg, stop_application)
                else:
                    # Verifica se o método existe em alguma classe-mãe
                    exists = next((True for parent in parents if func.__name__ in dir(parent)), False)
                    # Retorna erro se o método não existir em uma de suas classes-mãe
                    if not exists:
                        parents_list = ', '.join([parent.__name__ for parent in parents])
                        error_msg = f"O método {func.__name__}() da classe {cls.__name__} não está definido em sua(s) super classe(s) ({parents_list}) e por isso não foi sobrescrito"
                        throw_error(error_msg, stop_application)
                return func(*args, **kwargs)
            return wrapper
        return decorator(args[0]) if len(args) == 1 and callable(args[0]) else decorator