---
title: General Solutions to a Subclass of the 3x3 Semi-Magic Square Problem
---

(don't be intimated by the math. it's fun math. and you don't need anything more than a grade school education to follow along.)

This morning, my partner (who works at a school) provided me with a math challenge. Can you fill up a 3 by 3 grid with the number 1 through 9, where all columns and rows add up to the same number?

It might be fun to give it a try yourself. Can you come up with a solution? What did you learn in the process?

These squares (called "magic squares") are a common problem issued by teachers in grade school to provide students with practice in arithmetic. Since I have successfully passed sixth grade mathematics, I decided to challenge myself by not only coming up with a solution, but coming up with an algorithm to generate *all* valid solutions to the 3x3 semi-magic square problem. This is a very well-studied problem so I'm sure this is not new mathematics, but I wanted to at least solve it myself without reference to any papers.

My partner presented me with the following solution:

|   |   |   |
|:-:|:-:|:-:|
| 1 | 8 | 6 |
| 5 | 3 | 7 |
| 9 | 4 | 2 |

Where, upon further calculation, we can verify that each row and column sum to exactly 15. 

My partner made the further comment: "doesn't have to add to 15 i just did it that way".

Our first order of business it to show whether or not this is true; whether the row and column sum ("magic number") is always 15. This will provide us with a helpful invariant we can use in our algorithm. In fact, I will show that we can prove an even stronger claim: the sum of all rows and columns is always 90 (equivalently, the average sum of a row or column is 15, since there are exactly 6).

***Lemma 1***. The sum of all rows and columns in any 3x3 square filled with the numbers 1-9 is always 90.

***Proof***. Notice that each of the numbers 1 through 9 is counted twice: once in a row, and once in a column. Therefore, the sum of all columns and rows must be exactly double the sum of the numbers 1 through 9. The sum of 1 through 9 is the ninth [triangular number](https://en.wikipedia.org/wiki/Triangular_number) calculated as $T_9 = (9 + 1) \cdot \frac{9}{2} = 45$; therefore, the sum of columns and rows must be twice this, or equal to 90.

&#9632;

***Example***. Take the following randomly-generated square.

|   |   |   |
|:-:|:-:|:-:|
| 6 | 9 | 3 |
| 8 | 7 | 1 |
| 5 | 4 | 2 |

The rows sum to 18, 16, and 11. The columns sum to 19, 20, and 6. Add these together and you'll get 90.

***Bonus alternative proof to Lemma 1***. Write down the numbers 1-9 in a 3x3 grid. Sum the columns and rows and you'll get 90. Because each possible 3x3 square is a permutation of every other 3x3 square formed by swapping elements, the sum of 90 must remain constant. This is satisfactory, but we need to be convinced of the fact that every square can be reached from every other square by swapping elements pairwise. This is straightforward: we can always make swaps as long as at least two elements are dissimilar between two squares. This is always the case, because squares cannot only differ by one element due to uniqueness of the elements (1-9), and square that differ by zero elements are trivially the same.

If you do not understand this argument, then sit on it for a while, and if you still don't understand, you can safely ignore it. This is a good rule for life.

***Lemma 2***. The sum of a row or column of any solution must be 15 (i.e. the "magic number" is 15).

***Proof***. This follows directly from the fact that if any square filled with 1-9 must have rows and columns summing to 90 (*Lemma 1*), and the fact there are 6 rows + columns. Therefore if we impose the requirement that each row and column must be equal, they must all be 90/6=15.

&#9632;

Now, we have a very powerful fact: the sum of every row and column in a solution must always be 15.

This is still not the same as providing an algorithm for generating a solution, but it's helpful. I can see a few ways forward. Two of which are valid but are boring and uninstructive. And a third solution which is actually quite wonderful and exciting.

***Solution 1***. Brute-force. There are 9!=362880 possible squares, which is not too large of a space to search, and we can write a computer program to check which ones are valid solutions. Boring af.

***Solution 2***. Write down the following square:

|   |   |   |
|:-:|:-:|:-:|
| a | b | c |
| d | e | f |
| g | h | i |

Now, we can write the following systems of equations: $a+b+c=d+e+f=g+h+i=a+d+g=b+e+h=c+f+i=15$. Furthermore, we add the constraint that $\{a, ..., i\}$ must be a permutation of $\{1, ..., 9\}$. Plug it into a constraint solver and we get solutions. Still boring af and we learn nothing.

***Solution 3***. The main event.

I initially tried some sort of algorithm where you randomly generate a square, then pairwise-swap elements until you reach a solution. I think this is possible if the algorithm is constructed carefully. However, I gave up on this approach when I had an epiphany for something totally different, and quite beautiful.

So, we know that our magic number is 15. Notice anything about it? Well, how about the fact that it's an odd number? Surely, you say, this cannot have any relevance. Yet this will turn out to be a crucial fact.

Let's also list out the numbers 1 through 9 and examine their "parity" (i.e., their even-ness or odd-ness). There are five odd numbers (1, 3, 5, 7, 9) and four even numbers (2, 4, 6, 8).

Notice that each row and column in the 3x3 square is a sum formed from three addends, and that they must sum to 15 by Lemma 2. So how to we construct an odd number from summing three numbers? There are only two possible ways: all three numbers must be odd, or there must be two even numbers and one odd number (any other combination sums to an even number). As an exercise to the reader, see if you can prove this fact following from the mathematical definitions of "even" and "odd".

The above gives us:

***Lemma 3***. In any solution, a given row or column must have exactly zero or two even numbers. (**!!!!!!!!**)

Surprisingly, this constraint is enough to create our algorithm.

***Algorithm***. How to generate a 3x3 semi-magic square from the numbers 1-9.

**Step 1**. Arbitrarily pick an even number (2, 4, 6, 8) and place it into the 3x3 square. It will look something like this:

|   |   |   |
|:-:|:-:|:-:|
| * | * | * |
| 4 | * | * |
| * | * | * |

**Step 2**. We have three more even numbers to insert. Because we know from Lemma 3 that if there is an even number in a row or column, there must be exactly one more even number in that row or column, we must insert one even number into that row or column. This looks something like

|   |   |   |
|:-:|:-:|:-:|
| 2 | * | * |
| 4 | * | 8 |
| * | * | * |

And again we apply Lemma 3 which forces us to insert the last even number (6) in a fixed location:

|   |   |   |
|:-:|:-:|:-:|
| 2 | * | 6 |
| 4 | * | 8 |
| * | * | * |

**Step 3**. We use simple algebra to complete the remainder of the square.

|   |   |   |
|:-:|:-:|:-:|
| 2 | a | 6 |
| 4 | b | 8 |
| c | d | e |

We can easily solve $a = 15 - 6 - 2 = 7$ and similarly for $b$, $c$, and $e$. Once we have those, it is easy to solve for $d$.

|   |   |   |
|:-:|:-:|:-:|
| 2 | 7 | 6 |
| 4 | 3 | 8 |
| 9 | 5 | 1 |

Now, we have a magic square. (**!!!!**)

**Caveat** We have now discovered a surprising fact, which is that in any solution, the even numbers must form a sort of square or rectangle inscribed in the larger square. However, during Step 2, we must avoid forming impossible constraints. Here's an example of what I mean:

|   |   |   |
|:-:|:-:|:-:|
| 4 | a | 6 |
| 2 | b | 8 |
| c | d | e |

The above satisfies Lemma 3 but we also get a constradiction since this square requires that $a = b = 5$ which is impossible to satisfy due to all entries being unique. If avoid these sorts of contradictions in Step 2, we can construct all possible 3x3 semi-magic squares with the numbers 1-9.

**Final fun fact**. Once you have one magic square, you can swap rows and columns while keeping their sums constant, due to commutativity of addition.

I've added an interactive demo below for you to try out. Can you create your own magic square using the algorithm we've discussed?

<style>
#square-demo { text-align: center; user-select: none; -webkit-user-select: none; }
#square-demo .grid { display: inline-grid; grid-template-columns: repeat(3, 72px) 56px; grid-template-rows: repeat(3, 72px) 56px; gap: 6px; }
#square-demo .cell { display: flex; align-items: center; justify-content: center; font-size: 28px; border-radius: 8px; }
#square-demo .num { background: #eef3fb; border: 1px solid #b8c8e6; cursor: grab; touch-action: none; }
#square-demo .num.dragging { opacity: 0.3; }
#square-demo .num.over { background: #d6e4fa; }
#square-demo .sum { color: #888; font-size: 20px; }
#square-demo .sum.match { color: #1a8a3c; font-weight: bold; }
#square-demo .ghost { position: fixed; pointer-events: none; z-index: 10; width: 72px; height: 72px; background: #cfe0fa; border: 1px solid #6b93d6; box-shadow: 0 4px 12px rgba(0,0,0,.25); }
#square-demo button { margin-top: 16px; font: inherit; padding: 8px 18px; border-radius: 6px; border: 1px solid #0066cc; background: #fff; color: #0066cc; cursor: pointer; }
#square-demo .msg { min-height: 1.6em; margin-top: 12px; color: #1a8a3c; font-weight: bold; }
</style>

<div id="square-demo"></div>

<script src="squares.js"></script>
