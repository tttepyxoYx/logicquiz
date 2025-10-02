TS_FILES := $(wildcard *.ts)

JS_FILES := $(TS_FILES:.ts=.js)

XML_FILES := $(wildcard *.xml)

JSON_FILES := $(XML_FILES:.xml=.json)

JPG_FILES := $(wildcard *.jpg)

.PHONY: all

all: $(JS_FILES) $(JSON_FILES) $(JPG_FILES) 

%.js: %.ts
	- tsc $< 
	scpToWebsite.sh -f quizzes/logic $@
%.json: %.xml
	xmltojson $< > $@ && scpToWebsite.sh -f quizzes/logic $@
%.jpg: 
	scpToWebsite.sh -f quizzes/logic $@
index.html:
	scpToWebsite.sh -f quizzes/logic index.html
