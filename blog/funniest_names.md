---
title: Who has the funniest name?
---

During my weekly trivia night (shoutout to our host Ryan), I was enlightened with the knowledge that there once lived a man by the name [Preserved Fish](https://en.wikipedia.org/wiki/Preserved_Fish). I of course also recalled the famed mathematician Alexander Grothendieck. I endeavoured to find the person with the funniest name. I thought that it was definitely possible to write a program to aid me in this search. Apparently, I am the first person to use a programmatic approach to solve this problem (at least according to Claude), which comes as a shock to me, since the problem seems very tractable (when set up correctly).

All the code is open-source with an MIT license. You can get it [here](https://github.com/szge/funniest_name) and also find Python notebooks to follow along with the subsequent sections. Note that you want several GB of memory available to load the names dataset.

### Part 1: The Proof-of-Concept

**Associated Python notebook: `part1.ipynb`**

We begin by defining what it means for a name to sound funny. I considered an approach involving the pronunciation of names, but this seems hard to compute; in addition to computing a pronunciation of a given name, we'd also have to decipher some sort of meaning from that. Consider the classic example name "Hugh Jass" -- it's not immediately obvious to me how to write a program to convert this to the phrase "Huge Ass". A further consideration is that we'd need to execute this at scale across millions of names$^1$.

In Part 1, we progress by restricting ourselves to names that are composed of real, valid English words (e.g. "Signal Meta"). Depending on how big the result is, we can manually filter down to the funny ones, or use programmatic means to do so.

Given this approach, we now need to source two things: a giant list of names, and a dictionary (in either case, the bigger the better). For our list of names we have a helpful Python package named `names-dataset`, which contains almost 500 million names scraped from Facebook. This is the most comprehensive one I could find available to the public. For our dictionary, we will use WordNet$^2$.

The biggest issue with a naive implementation is that most dictionaries/word-corpora available do not include all variants of words. For example, the corpus might include the word "jerk" but may not include the past participle "jerked". Therefore, we will use `wordnet.synsets()` to handle this for us by accepting all variants of a word.

Finally, common names like Simon are part of many corpora, which is self-defeating for our purposes. It does not make sense to check if a name is one of these words. Therefore, we will exclude proper nouns or "instances" from our dictionary using `any(not syn.instance_hypernyms() for syn in wn.synsets(word))`. This accepts any word with a non-instance sense, and excludes words where every sense is an instance. For example, Simon would not be considered a valid word since all of its senses/definitions under WordNet are instances (e.g. "Simon the Apostle"), but Faith is acceptable despite being a proper noun since it has a non-instance meaning.

We'll finish by decorating our `is_real_word()` function with `@lru_cache`, which gives us $O(1)$ average time complexity for lookups and updates. Otherwise, we'd have to check the entire dictionary every time we wanted to know if a word is valid, which increases our execution time to an infeasible amount.

Here is our final code:

```
from names_dataset import NameDataset, NameWrapper
from functools import lru_cache
import nltk
from nltk.corpus import wordnet as wn

nd = NameDataset()
full_names = list(zip(nd.first_names.keys(), nd.last_names.keys()))

for corpus in ["wordnet", "omw-1.4"]:
    try:
        nltk.data.find(f"corpora/{corpus}")
    except LookupError:
        nltk.download(corpus)

@lru_cache(maxsize=None)
def is_real_word(word):
    # filter out proper nouns/"instance"s (e.g. "Simon"); only count non-instance senses as real words.
    # wn.synsets() already handles standard inflections ("jerked" -> "jerk").
    return any(not syn.instance_hypernyms() for syn in wn.synsets(word))

word_names = [name for name in full_names if is_real_word(name[0].lower()) and is_real_word(name[1].lower())]
print("number of word names:", len(word_names))
print("names:", word_names)
```

The result is saved to `names1.txt`.

Now we have a solid framework for finding names, and we have produced a working script that has produced a list of names. Unfortunately, the list is only 188 entries long and for the most part contains uninteresting names. We will remedy this in the following parts.

### Part 2: Partitioning

**Associated Python notebook: `part2.ipynb`**

The main issue with our previous approach is that we are restricting ourselves only to names where the first and last names are each real words. The way I thought of overcoming this is to allow for partitioning, i.e. we will check if parts of names are valid English words as well. To demonstrate what I mean, here is the partitioning code:

```
from itertools import combinations

MAX_PARTITIONS = 3

def get_all_partitions(s):
    n = len(s)
    for r in range(min(n, MAX_PARTITIONS)):
        for cuts in combinations(range(1, n), r):
            indices = [0, *cuts, n]
            yield [s[indices[i]:indices[i+1]] for i in range(len(indices) - 1)]

text = "abcde"
for partition in get_all_partitions(text):
    print(partition)
```

And here is the (example) output:
```
['abcde']
['a', 'bcde']
['ab', 'cde']
['abc', 'de']
['abcd', 'e']
['a', 'b', 'cde']
['a', 'bc', 'de']
['a', 'bcd', 'e']
['ab', 'c', 'de']
['ab', 'cd', 'e']
['abc', 'd', 'e']
```

Now, we have many more potential ways for a name to break down into valid words, which should yield a much greater number of results.

**A note on Bell numbers.** Bell numbers count the number of partitions of a set with size $n$. The sequence of Bell numbers goes 1, 1, 2, 5, 15, 52, 203, 877, and so on. Bell numbers grow [superexponentially](https://en.wikipedia.org/wiki/Bell_number#Properties), i.e. very fast. The average full (first + last) name length in our dataset is 15.12 characters, and there are [1382958545](https://oeis.org/A000110) ways to partition a set of size 15. Therefore, it is infeasible to check every possible restriction and we are forced to introduce a cap on the number of partitions allowed, which I have defined as `MAX_PARTITIONS`. A name which is broken up into a high number of partitions would be composed of mostly single-letter words, which wouldn't be very interesting anyways...

We run the computation and result is saved to `names2.txt`. We now have a list of almost 5000 names, but most of them are not very interesting, such as "Toyo Nashwan", which is apparently broken down into valid English words as "toyon ash wan". A toyon is apparently a type of rose shrub, so while I suppose these are valid words, it's not really the desired result. I have some ideas for how to improve our search that I will implement in Part 3.

### Part 3: Parallelization

**Associated Python notebook: `part3.ipynb`**

To increase the quality of our results, we need to increase the number of partitions that we search (from 3 to 5). To do this without making the execution time take too long, we introduce parallelization. Parallelization is a natural fit for our purposes since each name can be checked independently and the process has nothing to do with any other name.

For parallelization we can use Python's `ProcessPoolExecutor`. This has some quirks if we want to use it in a Jupyter notebook environment (worker processes may not be able to locate the correct function), so we will additionally move all of the functions that need to be called into a separate Python file, `word_partition.py`. The parallelization looks like this:

```
# part3.ipynb

import os
from concurrent.futures import ProcessPoolExecutor

word_names = []
with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
    for result in executor.map(process_full_name, full_names, chunksize=200):
        if result is not None:
            word_names.append(result)

print(word_names[:5])

# word_partition.py

def process_full_name(full_name):
    name = full_name[0].lower() + full_name[1].lower()
    partition = get_valid_word_partitions(name)
    if partition is None:
        return None
    return (*full_name, partition)
```

If everything has been set up correctly, we are able to generate our new list of names at this point. The resulting list is about 80000 names long. Here's a sample name from our new method: `Zlota Paswal z lota pa sw al` (the first two words are the original full name, and the remaining words are the breakdown into "valid English words"). The issue is that most of these words are nonsense. They're words with obscure definitions. Therefore, we'll add a restriction in our `is_real_word()` function to limit the dictionary to the top 10000 most frequent words (according to wordfreq's `top_n_list()`). 

Finally, we've arrived, like Odysseus landing in Ithaca. Our work has produced a reasonably-sized list of 1077 candidate names that we can read through to pick out the funniest ones. After manually picking out my favourite ones, I present to you the people with the funniest names in the world:

```
Winners:
Banan Assad (bananas sad)
Harmat Distance (harm at distance)
Javahir Evirus (Java hire virus)
Articles Angelface (articles angel face)
Japanac Eswar (japan aces war)
Normalin Konlog (normal ink on log)

Runners-up:
Notas Konwar (no task on war)
Swedish Morice (swedish mo rice)
Asdads Ankle (as dads ankle)
Basse Atson (bass eat son)
Centor Bellyman (cent or belly man)
Dogor Buzz (dog or buzz)
Hamad Dicon (ham add icon)
Late Gunson (late gun son)
Matter Ingwall (mattering wall)
Zipho Pasian (zip hop asian)
```

**Disclaimer** This is purely for entertainment. Please do not contact/harass/annoy anyone whose name is mentioned in this piece.

### Summary

We've used an iterative process going from proof-of-concept to a proper analysis of finding people with funny names. We've used common concepts in programming like caching and parallelization. We've demonstrated that an understanding of mathematics and complexity can be helpful in programming.

I'm a little disappointed that we don't have better names! Nothing on the final list appears to top Preserved Fish, but at least we have produced something.

There are definitely many ways to take this concept further. We could use LLMs. We could match words by sounds instead of spelling. We could use parts-of-speech to produce coherent phrases rather than just considering individual words (e.g. adverb-verb or adjective-noun). I'll leave this for future me or someone else.

### Addendum

1. Feeding a batch of names into an LLM API and asking the question "are any of these names funny?" would require on the order of 2 billion tokens or about $200 using deepseek-v4-flash (quite a cheap model) to process all 500 million names in the names-dataset. Still a bit pricey. Also, LLMs are terrible when it comes to humour. Perhaps there's a cleverer way to do this?
2. Since I am on a Macbook I initially tried using the raw `/usr/share/dict/words` (a long list of words available on Unix-like systems) as our English dictionary. I soon discovered that I couldn't naively search if a word belonged in the list since the list lacks various modifications like verb tenses (e.g. it contains "jerk" but not "jerked"). Therefore, I had to switch to using the WordNet corpus via nltk which gives us access to more powerful tools.