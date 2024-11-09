## STAT 405/705 Fall 2024 ASSIGNMENT 1
## NAME: Aman Sharma

## Q1.

### a Store your birthday number into a numeric variable called "bday". 
```
bday <- 10012004
```

### Now write code to find and print the answer for all parts:
### b The cube root of your birthday number.
```
cube_root_bday <- bday^(1/3)
```
output = 215.5296

### c The log base 16 of your birthday number.
```
log(bday, 16)
```
output = 5.813807

### d Your birthday number, modulo 7. (That's the remainder, after dividing by 7. Use the "%%" operator.)
```angular2html
bday %% 7
```
output = 2

### e Write code to create and store in a variable (vector) the first 1000 terms in the sequence: 
```angular2html
inv_sq <- sapply(1:1000, function(ind) 1 / ind^2)
```

### f Take the sequence in part e, sum all the elements, multiply the sum by 6, then finally take the square root.
```angular2html
print((sum(inv_sq) * 6) ^ (1/2))
```
output = 3.140638

## Q2.

### a  Create the two vectors of numbers alpha and beta
```angular2html
alpha <- seq(200, 1000, 25)
beta <- seq(60, 28, -1)
```


### b What is the sum of the elementwise product of the two vectors?
```angular2html
mult <- alpha * beta
```
output = 796400

### c What is the maximum value in the vector containing the elementwise products?
```
max_elem <- max(mult)
```
output = 28900

### d What is/are the indices (position in the vector) of the maximum value found in part c?
```
print(which(mult == max_elem))
```
output = 27

### e How many of the elements of the elementwise product vector are strictly greater than 19875?
```
print(sum(mult > 19875))
```
output = 25

### f How many of the elements of the elementwise product vector are strictly between 17875 and 28500?
```
print(sum(mult > 17875 & mult < 28500))
```
output = 18

## Q3.
### a Set the random number seed as your birthday number.
```angular2html
set.seed(bday)
```

### b Create two vectors, named x and y of standard normal random variables, each of length 10000000.
```angular2html
x <- rnorm(10000000)
y <- rnorm(10000000)
```

### c Create a third vector, called z, containing the elementwise square root of the sum of the squares of the elements.
```
z <- sqrt(x ^ 2 + y ^ 2)
```

### d  Find the average of the elements in the z vector. Print the result.
```
z_mean <- mean(z)
```
output = 1.252993

### e  Square the average and double it. Print the result.
```
print(2 * (z_mean ^2))
```
output = 3.139984

#### Q4.
### a  Enter the following 5 x 5 matrix into R and call it "mat.q4"
```angular2html
mat.q4 <- matrix(c(1, 0, 0, 0, 0,
1, 1, 0, 0, 0,
1, 2, 1, 0, 0,
1, 3, 3, 1, 0,
1, 4, 6, 4, 1),
nrow = 5, byrow = TRUE)
rownames(mat.q4) <- c("A", "B", "C", "D", "E")
colnames(mat.q4) <- c("Alpha", "Beta", "Gamma", "Delta", "Epsilon")
```


### b  Print the matrix and paste the printed output below.
| Symbol | Alpha | Beta | Gamma | Delta | Epsilon |
|--------|-------|------|-------|--------|---------|
| A      | 1     | 0    | 0     | 0      | 0       |
| B      | 1     | 1    | 0     | 0      | 0       |
| C      | 1     | 2    | 1     | 0      | 0       |
| D      | 1     | 3    | 3     | 1      | 0       |
| E      | 1     | 4    | 6     | 4      | 1       |


### c  Extract and print the submatrix corresponding to the second row, and the third and fifth columns. 
```angular2html
print(mat.q4[2, c(3, 5)])
```
output = 

| Gamma | Epsilon |
|-------|---------|
| 0     | 0       |


### d  Find the transpose of the matrix entered in part a (the transpose swaps the rows and columns).
```angular2html
m_t <- t(mat.q4)
```
output =

| Symbol | A | B | C | D | E |
|--------|---|---|---|---|---|
| Alpha  | 1 | 1 | 1 | 1 | 1 |
| Beta   | 0 | 1 | 2 | 3 | 4 |
| Gamma  | 0 | 0 | 1 | 3 | 6 |
| Delta  | 0 | 0 | 0 | 1 | 4 |
| Epsilon| 0 | 0 | 0 | 0 | 1 |

### e  Multiple the original matrix (on the left) by its transpose (on the right)
```angular2html
m_mult <- mat.q4 %*% m_t
```

#f  Find and print the inverse of the matrix created in part e.
```angular2html
m_inv <- solve(m_mult)
```
output =

| Row | A   | B   | C   | D   | E  |
|-----|-----|-----|-----|-----|----|
| A   | 5   | -10 | 10  | -5  | 1  |
| B   | -10 | 30  | -35 | 19  | -4 |
| C   | 10  | -35 | 46  | -27 | 6  |
| D   | -5  | 19  | -27 | 17  | -4 |
| E   | 1   | -4  | 6   | -4  | 1  |

### g  Find and print the sum of the elements of the leading diagonal of the inverse matrix.
```angular2html
print(sum(diag(m_inv)))
```
output = 99


## Q5. A market research company asked respondents the question ~~:4 or 5.

```
raw.scores <- c(1, 2, 1, 4, 4, 5, 2, 1, 1, 5,
5, 1, 3, 3, 3, 1, 4, 2, 2, 2,
3, 1, 1, 1, 3, 2, 3, 1, 4, 5)
```

### a Write code to create and store a logical vector that takes on the value TRUE if the raw score was either a 4 or a 5 and FALSE otherwise.
```logical_vector <- raw.scores == 4 | raw.scores == 5```


### b Using the logical vector from part a, replace the values 1, 2 and 3 in raw.scores with the value 1 and the values 4 and 5 with the value 5. 
```
mod.scores <- numeric(length(raw.scores))
mod.scores[!logical_vector] <- 1
mod.scores[logical_vector] <- 5
```

### c Create and store from "mod.scores" an ordered factor variable from the modified data with the labels "Not keen", and "Keen".
```angular2html
o_factor <- factor(mod.scores, ordered = TRUE,
levels = c(1, 5), labels = c("Not keen", "Keen"))
```

### d  Summarize the new data with the "table" command and paste the output below.
```
summary_table <- table(o_factor)
```
output = 

| Not Keen | Keen |
|----------|------|
| 22       | 8    |


### e  Write code to identify and print which of the two new levels occurred most frequently and how often it occurred.

```angular2html
most_frequent_level <- names(which.max(summary_table))
frequency <- max(summary_table)
```
Most frequent level was **Not keen** with frequency:  **22**

### aside: you can use the table output as input to the "pie" function which makes a pie chart.
```pie(summary_table, main = "Recommendation Levels", col = c("red", "green"))```

## Q6.

### a What is a key difference between the list extraction operators [ and $?
 $ Operator: This operator is used to extract elements from a list by name.
 It returns the element corresponding to the specified name as its original data type (not as a list)

 [ ] Operator: This operator can extract by index or by name, returning a sub-list.
 If we use [ ], the result is still a list, even if it contains only one element.

### b Reset the random number seed to your birthday seed.
```angular2html
set.seed(bday)
```

#### Paste the following code into R
```angular2html
my.list <- list(X = c(sample(x=100,size=100,replace=TRUE)), B = matrix(data=rnorm(36),ncol=6),
ZETA = list(ALPHA = matrix(data = sample(x=10,size=64,replace=TRUE),ncol=8),
BETA = matrix(data = rnorm(64),ncol=8)))
```

### c Write code to extract and print the value of the (3,6) element in the B matrix.
```angular2html
print(my.list$B[3, 6])
```
output =  -0.4995016

### d Write code to extract and find the sum of all of the elements in the matrix product (%*%) of ALPHA and BETA.
```angular2html
l_mult <- sum(my.list$ZETA$ALPHA %*% my.list$ZETA$BETA)
print(l_mult)
```
output = -185.89

### e Rename the element called "B", as "D", and paste both the command you used and the output from the names().
```angular2html
names(my.list)[names(my.list) == "B"] <- "D"
print(names(my.list))
```
output = [1] "X"    "D"    "ZETA"

