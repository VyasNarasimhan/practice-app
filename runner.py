import os
import socket
import subprocess

env = open('D:\\practice-app\\src\\environments\\environment.ts')
lines = []
for line in env.readlines():
    if 'apiRoot' not in line:
        lines.append(line)
    else:
        parts = line.split(': ')
        result = os.popen("ipconfig | findstr \"192.168.0\"").read()
        ipv4 = result.split("\n")[0].strip()[-13:]
        print(f'http://{ipv4}:4200')
        parts[1] = '\'http://' + ipv4 + ':4201\'\n'
        lines.append(parts[0] + ': ' + parts[1])
with open("D:\\practice-app\\src\\environments\\environment.ts", 'w') as dest:
    for line in lines:
        dest.write(f"{line}")
os.chdir("D:\\practice-app")
os.system("npm run dev")
#subprocess.call("npm run dev", cwd="D:\\practice-app")
