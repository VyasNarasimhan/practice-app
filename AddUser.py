import sys
import os

print(sys.argv[1])
newFile = open('/home/ubuntu/practice-app/server/songslogs/' + sys.argv[1] + 'SongsLog.json', 'w')
newFile.write('[]')
newFile.close()
