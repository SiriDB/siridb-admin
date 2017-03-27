#!/usr/bin/python3
import shutil
template = '''// +build !debug

package {package}

// {variable} is a byte representation for {fn}
var {variable} = []byte{{{bytes}}}
'''

binfiles = [
    ("./build/favicon.ico", "FileFaviconICO"),
    ("./build/index.html", "FileIndexHTML"),
    ("./build/bundle.min.js", "FileBundleMinJS"),
]


def compile(fn, variable):
    with open(fn, 'rb') as f:
        data = f.read()
    with open('{}.go'.format(variable.lower()), 'w', encoding='utf-8') as f:
        f.write(template.format(
            package='main',
            fn=fn,
            variable=variable,
            bytes=', '.join(str(c) for c in data)
        ))

if __name__ == '__main__':

    # copy favicon.ico
    shutil.copyfile('src/favicon.ico', 'build/favicon.ico')

    for bf in binfiles:
        compile(*bf)
