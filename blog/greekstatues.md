---
title: About 38% of Greek Statues are Male
---

I was recently intrigued by the following [Asmongold tweet](https://x.com/Asmongold/status/2060392930695643535?s=20):

> Men are naturally more attractive than women on average, that's why women need makeup
> 
> This isn't me being gay, it's science
> 
> Look at a peacock or a cardinal, male vs female, females get mogged
> 
> Greek statues dedicated to the peak aesthetic form? Overwhelmingly men

Particularly, I was intrigued by his claim that the number of Greek statues was "overwhelmingly men" (he also mentions "peak aesthetic form" but this is subjective). This brings up a good question. How many male and female Greek statues were there?

TL;DR the answer is that around X% of Greek statues were male.

The easiest and most accurate way to figure this out would be to simply see if an academic source plainly lists this number. An academic source doesn't exist, as far as I can tell. If someone can find a better way to search for these sources, please email me (I'd like to know!). [[1](https://claude.ai/share/51179d70-25b0-44b9-bdcb-7275138c5f6c)] [[2](https://www.jstor.org/action/doAdvancedSearch?q0=percentage&q1=ratio&f0=all&c1=OR&f1=all&acc=on&c2=AND&q2=men%2C+greek%2C+sculpture&f2=all&so=rel)] [[3](https://www.jstor.org/action/doBasicSearch?Query=%22percentage%22+of+men+greek+statues&so=rel)] [[4](https://claude.ai/share/60e6953e-451b-4189-b3e4-6eb919e22f7d)]

Since that doesn't exist, we are forced to try and compute the ratio ourselves through finding a data source and running some computations. The ideal data source will have the following properties: (1) large sample size (a sample size in the hundreds will not yield an accurate result); (2) contains samples across regions and time periods; (3) contain a "sex" or "gender" field in its metadata for easy parsing. It turns out that a dataset with property (3) doesn't actually exist, and thus we must find a way to determine sex by ourselves based on the information we're provided.

When working on a project, it's best to start with the simplest method you can think of; this can often give you a sense of feasibility, help you identify issues, and generally help you save time further down the road.

### Rough Baseline Estimate

The simplest method I can think of is simply to recall the rough ratio of male and female figures I've seen in museums in Athens. While I don't have an exact count, I'd say the ratio is roughly balanced; I can believe that the museum ratio might be anywhere from 30:70 to 70:30. This is extremely imprecise, and has some of its own biases (like what kinds of statues that museums tend to display), but it gives us a way to sanity check our calculations. Based on this information, it seems extremely unlikely that the ratio of sex for Greek sculpture would be something like 90:10, 5:95, or 1:99. If our later calculations yield such numbers, we'd want to really scrutinize our work.

### Ask Claude

The next simplest method is to just ask Claude Opus 4.8, the most intelligent AI model I have access to at the current time. [[5](https://claude.ai/share/51179d70-25b0-44b9-bdcb-7275138c5f6c)]. It turns out Claude doesn't do a great job at actually computing the right number, but it does point out a few relevant facts. For example, bronze and marble statues were often burned to turn into building materials. Sadly, some of the statues from the Parthenon were probably burned to obtain lime [[6](https://en.wikipedia.org/wiki/Elgin_Marbles#Acquisition)], leading to an irrecoverable loss for Western history and art. The fact that most statues were destroyed or are still buried is not relevant to our calculation, as we can only operate on the information we have found, but it is worth pointing out.

### Using the Met Website

Finally, we move onto trying to properly compute the sex ratio. We should try and find a representative data source for statues. Wikidata has a [Query Service](https://query.wikidata.org/) that allows you to query across structured data Wikimedia sister projects including Wikipedia, but this likely biases the dataset towards male figures (in ancient Greek society, women were mostly relegated to household affairs, and thus history is tilted towards discussing men). Let's use the [dataset maintained by The Met](https://www.metmuseum.org/art/collection/search?department=Greek+and+Roman+Art&geolocation=Greece&q=woman&searchField=Description). I am grateful to them for providing such a wonderful resource for free to the public.

Let's perform an easy preliminary calculation by searching for the keywords girl/woman/female, and boy/man/male in the online Met art collection. (I also tried the keywords "manly"/"womanly" and "masculine"/"feminine" but those returned few results)

Results

| Keyword | Count |
| ------- | ----- |
| girl    | 104   |
| woman   | 1,949 |
| female  | 564   |
| boy     | 162   |
| man     | 860   |
| male    | 2,884 |
We get a final count of 2617 females (40%) and 3906 males (60%). Interestingly, most of the females are linked to the keyword "woman", but most of of the males are linked to the keyword "male" (rather than "man"); not sure why this would be the case. There are a couple caveats to talk about here. There is probably some decent overlap in this data, for example with some objects containing both keywords "girl" and "woman" in their description being counted twice. Double-counting likely skews the calculation towards a 50/50 ratio. Secondly, objects like [Stone votive relief of male genitalia](https://www.metmuseum.org/art/collection/search/244055) are included, which we can choose whether to include or exclude from a proper counting; we may decide this doesn't constitute a proper statue. In this case, it would probably be somewhat difficult to filter out such cases without manually going through the dataset, and I'm not really opposed to keeping it in the counting (since it does depict a part of a man). Additionally, this dataset also includes things like pottery. If we filter to strictly the "sculpture" category, we get 160 results for girl/woman/female (70%) and 67 results for boy/man/male (30%) but this is a very low sample size.

Side tangent: I find it interesting how [herms](https://en.wikipedia.org/wiki/Herm_(sculpture)) (squared stone pillar with a head on top) most often had male genitalia carved on the front (and very little else, apart from perhaps text). This could be because they often depicted Hermes, who is associated with fertility. Google "Greek herm" to see a lot of penises.

### Using the Met Open Access API

I tried using the Met Open Access API as well, using the two ways they provide: [a large CSV served through Git LFS](https://github.com/metmuseum/openaccess), as well as their [https://metmuseum.github.io/](https://metmuseum.github.io/). Unfortunately, it appears that neither of the two methods provide access to the descriptions of the queried objects, which is crucial for our analysis. Take for example [Object ID 239584](https://www.metmuseum.org/art/collection/search/239584); you can clearly see the description on the webpage, but this information does not appear when you query the same object via API or searching through the Open Access CSV. We could perform web scraping, but this would be a lot of work, might violate their terms of service, and the result would probably be the same as just searching for the keywords in the search bar as we have already done.

### The Greek National Aggregator of Digital Cultural Content

This is the best resource I've found so far. I'll consider our search period from 800 - 146 BC, which spans the beginning of the Archaic period until the beginning of the Roman period. Searching for sculptures yields 6133 results. Let's create our search terms for women: girl/woman/female/κορίτσι/κοπέλα/κόρη/γυναίκα/γυνή/θηλυκός/θήλυ (Greek terms are translations of the English versions). Ideally we'd include a few more, but there is a limit of 10 search terms on the site. There are 2524 results. Next, let's create a [search](https://www.searchculture.gr/aggregator/portal/advancedSearch/search?portalSearches%5B0%5D.keywords%5B0%5D.value=boy&portalSearches%5B0%5D.keywords%5B1%5D.value=man&portalSearches%5B0%5D.keywords%5B2%5D.value=male&portalSearches%5B0%5D.keywords%5B3%5D.value=%CE%B1%CE%B3%CF%8C%CF%81%CE%B9&portalSearches%5B0%5D.keywords%5B4%5D.value=%CF%80%CE%B1%CE%B9%CE%B4%CE%AF&portalSearches%5B0%5D.keywords%5B5%5D.value=%CE%AC%CE%BD%CE%B8%CF%81%CF%89%CF%80%CE%BF%CF%82&portalSearches%5B0%5D.keywords%5B6%5D.value=%CE%AC%CE%BD%CE%B4%CF%81%CE%B1%CF%82&portalSearches%5B0%5D.keywords%5B7%5D.value=%CE%B5%CF%80%CE%B1%CE%BD%CE%B4%CF%81%CF%8E&portalSearches%5B0%5D.keywords%5B8%5D.value=%CE%B1%CF%81%CF%83%CE%B5%CE%BD%CE%B9%CE%BA%CF%8C%CF%82&portalSearches%5B0%5D.keywords%5B9%5D.value=%CE%AC%CF%81%CF%81%CE%B5%CE%BD&portalSearches%5B0%5D.keywordsBooleanOperator=OR&portalSearches%5B0%5D.ektTypes=http%3A%2F%2Fsemantics.gr%2Fauthorities%2Fekt-item-types%2Fglypto&_portalSearches%5B0%5D.ektTypes=1&_portalSearches%5B0%5D.strictPeriods=on&portalSearches%5B0%5D.ektYearSpan=800+B.C.+-+146+B.C.&portalSearches%5B0%5D.temporalSearchMode=YEAR_SPAN&_portalSearches%5B0%5D.imageOrVideSizes=1&_portalSearches%5B0%5D.formats=1&page.page=1&resultsMode=GRID&sortResults=SCORE) for boy/man/male/αγόρι/παιδί/άνθρωπος/άνδρας/επανδρώ/αρσενικός/άρρεν. There are 1553 results.

The final result: according to the Greek National Aggregator of Digital Cultural Content, the most comprehensive resource we have, Greek sculpture is 62% female. Therefore, it's inaccurate to state that Greek statues were "overwhelmingly men". Of course it's impossible to get a true count since so much has been lost to history, but at the very least we can now know that the gender ratio of Greek sculpture was roughly balanced.