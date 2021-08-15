import sys

print(sys.argv[0])
newFile = open('server\\songslogs\\' + sys.argv[0] + 'SongsLog.json', 'w')
newFile.write('[]')
newFile.close()