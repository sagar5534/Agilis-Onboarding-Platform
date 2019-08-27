
f=open("/Users/sagar/Documents/Agilis/Portal/templates/forms/index.html", "r")

contents =f.read()
print(contents)

x = contents.find('<html')
print(x)

f.close() 