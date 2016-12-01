import os
from jsmin import jsmin
subdir = 'dy/'

minified = ""
for fn in os.listdir(subdir):
    fpth = os.path.join(subdir,fn)
    if os.path.isfile(fpth):
        print fpth
        with open(fpth) as js_file: minified += js_file.read()
    
minified = jsmin(minified)
#print minified
with open("dy.v0.min.js", "w") as text_file: text_file.write(minified)