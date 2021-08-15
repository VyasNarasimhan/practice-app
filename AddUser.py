import sys

print(sys.argv[1])
newFile = open('server\\songslogs\\' + sys.argv[1] + 'SongsLog.json', 'w')
newFile.write('[]')
newFile.close()