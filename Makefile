XML_FILES := $(wildcard *.xml)

JSON_FILES := $(XML_FILES:.xml=.json)

.PHONY: all

all: quizScript.js $(JSON_FILES) 

quizScript.js: quizScript.ts
	- tsc $< 
%.json: %.xml
	perl -pe 's|quiz.json|$@|' quizScript.js > _.js
	perl -pe 's|(script>)(</script)|my $$scr = do { local $$/; open my $$fh, "<", "_.js" or die $$!; <$$fh> }; $$1 . $$scr . $$2|xe' baseindex.html > index.html
	rm _.js
	xmltojson $< > $@ && scpToWebsite.sh -f quizzes/$(basename $<) $@
	rm $@
	scpToWebsite.sh -f quizzes/$(basename $<) index.html
	rm index.html
