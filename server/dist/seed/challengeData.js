"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengesByCourseSlug = void 0;
exports.challengesByCourseSlug = {
    // 1. Modern Full-Stack Engineering with MERN
    'modern-full-stack-engineering-with-mern': [
        {
            title: 'Parse Query String Parameters',
            problemStatement: 'Implement a function `solution(queryString)` that parses a URL query string (without the leading "?") into an object mapping parameter keys to values. All values should be decoded strings. If the string is empty, return an empty object `{}`.',
            difficulty: 'Easy',
            topicTags: ['Web Development', 'Strings', 'Objects', 'MERN'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(queryString) {\n  if (!queryString) return {};\n  const pairs = queryString.split('&');\n  const result = {};\n  for (const pair of pairs) {\n    if (!pair) continue;\n    const [key, value] = pair.split('=');\n    result[decodeURIComponent(key)] = decodeURIComponent(value || '');\n  }\n  return result;\n}`,
                python: `def solution(query_string):\n  if not query_string:\n    return {}\n  import urllib.parse\n  pairs = query_string.split('&')\n  res = {}\n  for pair in pairs:\n    if not pair:\n      continue\n    parts = pair.split('=', 1)\n    key = urllib.parse.unquote(parts[0])\n    val = urllib.parse.unquote(parts[1]) if len(parts) > 1 else ''\n    res[key] = val\n  return res`,
            },
            inputFormat: 'queryString (string)',
            outputFormat: 'object (key-value mapping)',
            sampleTestCases: [
                { input: '"page=2&limit=20"', expectedOutput: '{"page":"2","limit":"20"}', explanation: 'Extracts page and limit keys into a JavaScript object.' },
                { input: '"category=tech&sort=recent"', expectedOutput: '{"category":"tech","sort":"recent"}', explanation: 'Extracts category and sort keys.' },
            ],
            hiddenTestCases: [
                { input: '""', expectedOutput: '{}', explanation: 'Empty query string returns empty object.' },
                { input: '"search=react%2018&lang=en"', expectedOutput: '{"search":"react 18","lang":"en"}', explanation: 'Decodes URL-encoded parameters correctly.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Extract JWT Token Payload',
            problemStatement: 'In JWT authentication, tokens consist of three base64-encoded segments separated by dots: `header.payload.signature`. Implement a function `solution(token)` that extracts and decodes the JSON payload into an object. If the token is invalid or does not have 3 parts, return `null`.',
            difficulty: 'Medium',
            topicTags: ['MERN', 'Authentication', 'Security', 'JWT'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(token) {\n  if (!token || typeof token !== 'string') return null;\n  const parts = token.split('.');\n  if (parts.length !== 3) return null;\n  try {\n    const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');\n    return JSON.parse(payloadJson);\n  } catch (err) {\n    return null;\n  }\n}`,
                python: `def solution(token):\n  if not token or not isinstance(token, str):\n    return None\n  import base64, json\n  parts = token.split('.')\n  if len(parts) != 3:\n    return None\n  try:\n    padded = parts[1] + '=' * (-len(parts[1]) % 4)\n    decoded = base64.b64decode(padded).decode('utf-8')\n    return json.loads(decoded)\n  except Exception:\n    return None`,
            },
            inputFormat: 'token (string)',
            outputFormat: 'object or null',
            sampleTestCases: [
                { input: '"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0NSIsInJvbGUiOiJsZWFybmVyIn0.signature"', expectedOutput: '{"userId":"12345","role":"learner"}', explanation: 'Decodes valid JWT payload into user object.' },
                { input: '"invalid-token-without-parts"', expectedOutput: 'null', explanation: 'Returns null for malformed tokens.' },
            ],
            hiddenTestCases: [
                { input: '"a.eyJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIn0.c"', expectedOutput: '{"email":"alice@example.com"}', explanation: 'Decodes single key JWT payload.' },
                { input: '""', expectedOutput: 'null', explanation: 'Returns null for empty string.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 2. React 18 & Design System Architecture
    'react-18-and-design-system-architecture': [
        {
            title: 'Class Name Combiner Utility',
            problemStatement: 'Implement a utility function `solution(...classes)` (similar to clsx/classnames) that accepts any number of arguments (strings, null, undefined, false, or numbers) and returns a clean, space-separated string containing only truthy class names.',
            difficulty: 'Easy',
            topicTags: ['React', 'Web Development', 'Design Systems', 'Utilities'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(...classes) {\n  return classes\n    .flat(Infinity)\n    .filter((c) => Boolean(c) && typeof c === 'string')\n    .map((c) => c.trim())\n    .filter(Boolean)\n    .join(' ');\n}`,
                python: `def solution(*classes):\n  result = []\n  for c in classes:\n    if c and isinstance(c, str) and c.strip():\n      result.append(c.strip())\n  return ' '.join(result)`,
            },
            inputFormat: 'variable arguments (...classes: string | null | undefined | boolean)',
            outputFormat: 'string (space-delimited truthy class names)',
            sampleTestCases: [
                { input: '["btn", "btn-primary", false, null, "active"]', expectedOutput: '"btn btn-primary active"', explanation: 'Filters out false and null values.' },
                { input: '["card", undefined, "shadow-sm", ""]', expectedOutput: '"card shadow-sm"', explanation: 'Filters out undefined and empty strings.' },
            ],
            hiddenTestCases: [
                { input: '["container", "  mx-auto  ", "px-4"]', expectedOutput: '"container mx-auto px-4"', explanation: 'Trims leading/trailing whitespace.' },
                { input: '[null, undefined, false, ""]', expectedOutput: '""', explanation: 'Returns empty string when no valid classes provided.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Flatten Nested Component Tree',
            problemStatement: 'Design systems often receive tree hierarchies of navigation items or component menus. Write a function `solution(tree)` that flattens a recursive tree of nodes `{ id: string, label: string, children?: Node[] }` into a flat list of node ids in Depth-First Search pre-order.',
            difficulty: 'Medium',
            topicTags: ['React', 'Tree Traversal', 'Recursion', 'Design Systems'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(tree) {\n  const result = [];\n  function dfs(node) {\n    if (!node) return;\n    result.push(node.id);\n    if (Array.isArray(node.children)) {\n      for (const child of node.children) {\n        dfs(child);\n      }\n    }\n  }\n  if (Array.isArray(tree)) {\n    tree.forEach(dfs);\n  } else if (tree) {\n    dfs(tree);\n  }\n  return result;\n}`,
                python: `def solution(tree):\n  result = []\n  def dfs(node):\n    if not node: return\n    result.append(node['id'])\n    for child in node.get('children', []):\n      dfs(child)\n  if isinstance(tree, list):\n    for item in tree: dfs(item)\n  elif tree:\n    dfs(tree)\n  return result`,
            },
            inputFormat: 'tree (Node or Node[])',
            outputFormat: 'string[] (flat array of node IDs in pre-order)',
            sampleTestCases: [
                { input: '[{"id": "root", "label": "Root", "children": [{"id": "child-1", "label": "Child 1"}, {"id": "child-2", "label": "Child 2"}]}]', expectedOutput: '["root","child-1","child-2"]', explanation: 'Flattens root and its two direct children in pre-order.' },
                { input: '[{"id": "nav", "label": "Nav", "children": [{"id": "docs", "label": "Docs", "children": [{"id": "api", "label": "API"}]}]}]', expectedOutput: '["nav","docs","api"]', explanation: 'Flattens a 3-level deep tree.' },
            ],
            hiddenTestCases: [
                { input: '[{"id": "single", "label": "Single"}]', expectedOutput: '["single"]', explanation: 'Handles single node with no children.' },
                { input: '[]', expectedOutput: '[]', explanation: 'Returns empty array for empty tree.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 3. Node.js Microservices & Distributed APIs
    'nodejs-microservices-and-distributed-apis': [
        {
            title: 'Calculate Exponential Backoff Delay',
            problemStatement: 'Write a function `solution(attempt, baseDelayMs, maxDelayMs)` that calculates the retry delay for a given attempt index using exponential backoff: `Math.min(maxDelayMs, baseDelayMs * (2 ** attempt))`. For attempt 0, it should return baseDelayMs (up to maxDelayMs).',
            difficulty: 'Easy',
            topicTags: ['Node.js', 'Algorithms', 'Resilience', 'Microservices'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(attempt, baseDelayMs, maxDelayMs) {\n  const delay = baseDelayMs * Math.pow(2, attempt);\n  return Math.min(maxDelayMs, delay);\n}`,
                python: `def solution(attempt, base_delay_ms, max_delay_ms):\n  delay = base_delay_ms * (2 ** attempt)\n  return min(max_delay_ms, delay)`,
            },
            inputFormat: 'attempt (number), baseDelayMs (number), maxDelayMs (number)',
            outputFormat: 'number (delay in milliseconds)',
            sampleTestCases: [
                { input: '[0, 100, 5000]', expectedOutput: '100', explanation: 'Attempt 0 gives base delay 100ms.' },
                { input: '[3, 100, 5000]', expectedOutput: '800', explanation: 'Attempt 3 gives 100 * 2^3 = 800ms.' },
            ],
            hiddenTestCases: [
                { input: '[10, 100, 5000]', expectedOutput: '5000', explanation: 'Attempt 10 caps at maxDelayMs 5000ms.' },
                { input: '[2, 500, 1000]', expectedOutput: '1000', explanation: 'Attempt 2 gives 500 * 4 = 2000, capped at 1000ms.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Token Bucket Rate Limiter Capacity',
            problemStatement: 'Implement a Token Bucket calculator `solution(capacity, refillRatePerSec, timeElapsedSec, tokensRequested)`. Calculate available tokens after time has elapsed: `Math.min(capacity, currentTokens + refillRatePerSec * timeElapsedSec)`. Assume the bucket starts empty (0 tokens). If available tokens >= tokensRequested, return `true`; otherwise return `false`.',
            difficulty: 'Medium',
            topicTags: ['Node.js', 'Rate Limiting', 'Microservices', 'Distributed Systems'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(capacity, refillRatePerSec, timeElapsedSec, tokensRequested) {\n  const accumulated = refillRatePerSec * timeElapsedSec;\n  const currentTokens = Math.min(capacity, accumulated);\n  return currentTokens >= tokensRequested;\n}`,
                python: `def solution(capacity, refill_rate_per_sec, time_elapsed_sec, tokens_requested):\n  accumulated = refill_rate_per_sec * time_elapsed_sec\n  current_tokens = min(capacity, accumulated)\n  return current_tokens >= tokens_requested`,
            },
            inputFormat: 'capacity (number), refillRatePerSec (number), timeElapsedSec (number), tokensRequested (number)',
            outputFormat: 'boolean',
            sampleTestCases: [
                { input: '[10, 2, 5, 8]', expectedOutput: 'true', explanation: '2 tokens/sec * 5s = 10 tokens. 10 >= 8 requests, so allowed.' },
                { input: '[10, 1, 2, 5]', expectedOutput: 'false', explanation: '1 token/sec * 2s = 2 tokens. 2 < 5 requests, so rate limited.' },
            ],
            hiddenTestCases: [
                { input: '[5, 10, 10, 5]', expectedOutput: 'true', explanation: 'Bucket fills to max capacity 5. 5 >= 5 tokens requested.' },
                { input: '[50, 5, 3, 20]', expectedOutput: 'false', explanation: '5 * 3 = 15 tokens. 15 < 20 requested, returns false.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 4. Python for Systems & Scientific Computing
    'python-for-systems-and-scientific-computing': [
        {
            title: 'Validate Palindrome String',
            problemStatement: 'Write a function `solution(s)` that determines if an alphanumeric string is a palindrome, ignoring non-alphanumeric characters and letter casing. Return `true` if it is a palindrome, and `false` otherwise.',
            difficulty: 'Easy',
            topicTags: ['Python', 'Strings', 'Algorithms', 'Validation'],
            supportedLanguages: ['python', 'javascript'],
            starterCode: {
                python: `def solution(s):\n  import re\n  clean = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n  return clean == clean[::-1]`,
                javascript: `function solution(s) {\n  const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\n  return clean === clean.split('').reverse().join('');\n}`,
            },
            inputFormat: 's (string)',
            outputFormat: 'boolean',
            sampleTestCases: [
                { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', explanation: 'Cleans to "amanaplanacanalpanama", which reads the same backward.' },
                { input: '"race a car"', expectedOutput: 'false', explanation: 'Cleans to "raceacar", which is not a palindrome.' },
            ],
            hiddenTestCases: [
                { input: '"Was it a car or a cat I saw?"', expectedOutput: 'true', explanation: 'Valid palindrome sentence.' },
                { input: '"0P"', expectedOutput: 'false', explanation: 'Not a palindrome.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Matrix Transposition',
            problemStatement: 'In scientific computing, matrix operations are fundamental. Implement a function `solution(matrix)` that computes and returns the transpose of an m x n 2D numerical array (turning rows into columns).',
            difficulty: 'Medium',
            topicTags: ['Python', 'NumPy', 'Linear Algebra', 'Scientific Computing'],
            supportedLanguages: ['python', 'javascript'],
            starterCode: {
                python: `def solution(matrix):\n  if not matrix or not matrix[0]:\n    return []\n  return [list(row) for row in zip(*matrix)]`,
                javascript: `function solution(matrix) {\n  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return [];\n  const rows = matrix.length;\n  const cols = matrix[0].length;\n  const transposed = [];\n  for (let c = 0; c < cols; c++) {\n    const newRow = [];\n    for (let r = 0; r < rows; r++) {\n      newRow.push(matrix[r][c]);\n    }\n    transposed.push(newRow);\n  }\n  return transposed;\n}`,
            },
            inputFormat: 'matrix (number[][])',
            outputFormat: 'number[][] (transposed 2D array)',
            sampleTestCases: [
                { input: '[[[1, 2, 3], [4, 5, 6]]]', expectedOutput: '[[1,4],[2,5],[3,6]]', explanation: 'Transposes a 2x3 matrix into a 3x2 matrix.' },
                { input: '[[[1, 2], [3, 4]]]', expectedOutput: '[[1,3],[2,4]]', explanation: 'Transposes a 2x2 square matrix.' },
            ],
            hiddenTestCases: [
                { input: '[[[10], [20], [30]]]', expectedOutput: '[[10,20,30]]', explanation: 'Transposes a 3x1 column vector into a 1x3 row.' },
                { input: '[[[5, 10, 15]]]', expectedOutput: '[[5],[10],[15]]', explanation: 'Transposes a 1x3 row into a 3x1 column.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 5. Enterprise Java & Spring Boot Microservices
    'enterprise-java-and-spring-boot-microservices': [
        {
            title: 'First Unique Character in Stream',
            problemStatement: 'In enterprise message ingestion pipelines, finding unrepeated identifiers is a common pattern. Implement a function `solution(s)` that finds the first non-repeating character in a string and returns its 0-based index. If every character repeats, return `-1`.',
            difficulty: 'Easy',
            topicTags: ['Java', 'Spring Boot', 'Hash Map', 'Strings'],
            supportedLanguages: ['java', 'javascript', 'python'],
            starterCode: {
                java: `public class Solution {\n    public int solution(String s) {\n        int[] counts = new int[256];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i)]++;\n        }\n        for (int i = 0; i < s.length(); i++) {\n            if (counts[s.charAt(i)] == 1) return i;\n        }\n        return -1;\n    }\n}`,
                javascript: `function solution(s) {\n  const counts = {};\n  for (const char of s) {\n    counts[char] = (counts[char] || 0) + 1;\n  }\n  for (let i = 0; i < s.length; i++) {\n    if (counts[s[i]] === 1) return i;\n  }\n  return -1;\n}`,
                python: `def solution(s):\n  from collections import Counter\n  counts = Counter(s)\n  for i, c in enumerate(s):\n    if counts[c] == 1: return i\n  return -1`,
            },
            inputFormat: 's (string)',
            outputFormat: 'number (0-based index or -1)',
            sampleTestCases: [
                { input: '"certipro"', expectedOutput: '0', explanation: '\'c\' is the first non-repeating character at index 0.' },
                { input: '"loveleetcode"', expectedOutput: '2', explanation: '\'v\' is the first non-repeating character at index 2.' },
            ],
            hiddenTestCases: [
                { input: '"aabbcc"', expectedOutput: '-1', explanation: 'All characters repeat, returns -1.' },
                { input: '"springcloud"', expectedOutput: '0', explanation: 'First character \'s\' is unique.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'LRU Cache Eviction Order',
            problemStatement: 'Enterprise microservices use Least Recently Used (LRU) caches to maintain in-memory datasets. Write a function `solution(capacity, operations)` that takes a cache capacity and an array of key-access strings, and returns the current cache contents ordered from most-recently accessed to least-recently accessed.',
            difficulty: 'Medium',
            topicTags: ['Java', 'Data Structures', 'Caching', 'LRU'],
            supportedLanguages: ['java', 'javascript', 'python'],
            starterCode: {
                java: `public class Solution {\n    public String[] solution(int capacity, String[] operations) {\n        java.util.LinkedHashSet<String> set = new java.util.LinkedHashSet<>();\n        for (String op : operations) {\n            if (set.contains(op)) set.remove(op);\n            else if (set.size() >= capacity) {\n                String oldest = set.iterator().next();\n                set.remove(oldest);\n            }\n            set.add(op);\n        }\n        java.util.List<String> list = new java.util.ArrayList<>(set);\n        java.util.Collections.reverse(list);\n        return list.toArray(new String[0]);\n    }\n}`,
                javascript: `function solution(capacity, operations) {\n  const cache = new Map();\n  for (const key of operations) {\n    if (cache.has(key)) {\n      cache.delete(key);\n    } else if (cache.size >= capacity) {\n      const oldest = cache.keys().next().value;\n      cache.delete(oldest);\n    }\n    cache.set(key, true);\n  }\n  return Array.from(cache.keys()).reverse();\n}`,
                python: `def solution(capacity, operations):\n  from collections import OrderedDict\n  cache = OrderedDict()\n  for op in operations:\n    if op in cache:\n      cache.move_to_end(op)\n    else:\n      if len(cache) >= capacity:\n        cache.popitem(last=False)\n      cache[op] = True\n  return list(reversed(list(cache.keys())))`,
            },
            inputFormat: 'capacity (number), operations (string[])',
            outputFormat: 'string[] (cache keys from MRU to LRU)',
            sampleTestCases: [
                { input: '[2, ["A", "B", "A", "C"]]', expectedOutput: '["C","A"]', explanation: 'Capacity 2: accessing C evicts B because A was accessed recently.' },
                { input: '[3, ["user1", "user2", "user3", "user1", "user4"]]', expectedOutput: '["user4","user1","user3"]', explanation: 'Evicts user2 as the least recently used entry.' },
            ],
            hiddenTestCases: [
                { input: '[1, ["K1", "K2", "K3"]]', expectedOutput: '["K3"]', explanation: 'Capacity 1 retains only the latest accessed key.' },
                { input: '[3, ["A", "B", "C"]]', expectedOutput: '["C","B","A"]', explanation: 'Under capacity retains all keys ordered by access.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 6. Machine Learning from Scratch with Python
    'machine-learning-from-scratch-with-python': [
        {
            title: 'Compute Mean Squared Error',
            problemStatement: 'Write a function `solution(actual, predicted)` that takes two numerical arrays of equal length and returns the Mean Squared Error (MSE) rounded to 4 decimal places: `sum((actual[i] - predicted[i])^2) / n`.',
            difficulty: 'Easy',
            topicTags: ['Machine Learning', 'Math', 'Arrays', 'Metrics'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(actual, predicted) {\n  let sum = 0;\n  for (let i = 0; i < actual.length; i++) {\n    sum += Math.pow(actual[i] - predicted[i], 2);\n  }\n  return parseFloat((sum / actual.length).toFixed(4));\n}`,
                python: `def solution(actual, predicted):\n  total = sum((a - p) ** 2 for a, p in zip(actual, predicted))\n  return round(total / len(actual), 4)`,
            },
            inputFormat: 'actual (number[]), predicted (number[])',
            outputFormat: 'number (MSE rounded to 4 decimals)',
            sampleTestCases: [
                { input: '[[1, 2, 3], [1, 2, 3]]', expectedOutput: '0', explanation: 'Predictions match actuals exactly.' },
                { input: '[[1, 2, 3], [2, 3, 4]]', expectedOutput: '1', explanation: 'Each difference is 1; average squared error is 1.' },
            ],
            hiddenTestCases: [
                { input: '[[10, 20, 30], [12, 18, 33]]', expectedOutput: '5.6667', explanation: 'Correctly computes and rounds fractional MSE.' },
                { input: '[[0, 0, 0], [1, 1, 1]]', expectedOutput: '1', explanation: 'Constant deviation of 1.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Compute Sigmoid Activation Value',
            problemStatement: 'Implement the logistic sigmoid activation function `solution(z)` defined as `1 / (1 + exp(-z))` rounded to 4 decimal places. For any real input number `z`, return the output probability in the interval (0, 1).',
            difficulty: 'Easy',
            topicTags: ['Machine Learning', 'Math', 'Activation Functions', 'Neural Networks'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(z) {\n  const res = 1 / (1 + Math.exp(-z));\n  return parseFloat(res.toFixed(4));\n}`,
                python: `def solution(z):\n  import math\n  res = 1.0 / (1.0 + math.exp(-z))\n  return round(res, 4)`,
            },
            inputFormat: 'z (number)',
            outputFormat: 'number (Sigmoid value rounded to 4 decimals)',
            sampleTestCases: [
                { input: '0', expectedOutput: '0.5', explanation: 'Sigmoid of 0 is exactly 0.5.' },
                { input: '2', expectedOutput: '0.8808', explanation: 'Sigmoid of 2 is ~0.8808.' },
            ],
            hiddenTestCases: [
                { input: '-2', expectedOutput: '0.1192', explanation: 'Sigmoid of -2 is 1 - 0.8808 = 0.1192.' },
                { input: '5', expectedOutput: '0.9933', explanation: 'Sigmoid saturates close to 1 for positive z.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 7. Practical Data Science & Statistical Analysis
    'practical-data-science-and-statistical-analysis': [
        {
            title: 'Calculate Median of Array',
            problemStatement: 'Write a function `solution(numbers)` that calculates and returns the median value of a numerical array. For an odd number of items, return the middle element of the sorted array; for an even number, return the average of the two middle elements.',
            difficulty: 'Easy',
            topicTags: ['Data Science', 'Statistics', 'Math', 'Arrays'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(numbers) {\n  if (!numbers || numbers.length === 0) return 0;\n  const sorted = [...numbers].sort((a, b) => a - b);\n  const mid = Math.floor(sorted.length / 2);\n  if (sorted.length % 2 === 1) {\n    return sorted[mid];\n  } else {\n    return (sorted[mid - 1] + sorted[mid]) / 2;\n  }\n}`,
                python: `def solution(numbers):\n  if not numbers: return 0\n  s = sorted(numbers)\n  n = len(s)\n  mid = n // 2\n  if n % 2 == 1: return s[mid]\n  return (s[mid - 1] + s[mid]) / 2.0`,
            },
            inputFormat: 'numbers (number[])',
            outputFormat: 'number (median value)',
            sampleTestCases: [
                { input: '[5, 2, 9, 1, 7]', expectedOutput: '5', explanation: 'Sorted: [1, 2, 5, 7, 9]. Middle element is 5.' },
                { input: '[4, 1, 7, 2]', expectedOutput: '3', explanation: 'Sorted: [1, 2, 4, 7]. Average of 2 and 4 is 3.' },
            ],
            hiddenTestCases: [
                { input: '[100]', expectedOutput: '100', explanation: 'Single element array median is the element itself.' },
                { input: '[10, 20, 30, 40]', expectedOutput: '25', explanation: 'Average of 20 and 30 is 25.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Calculate Population Standard Deviation',
            problemStatement: 'Write a function `solution(values)` that calculates the population standard deviation of an array of numbers, rounded to 2 decimal places: `sqrt(sum((x - mean)^2) / N)`. If array is empty, return 0.',
            difficulty: 'Medium',
            topicTags: ['Data Science', 'Statistics', 'Math', 'Variance'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(values) {\n  if (!values || values.length === 0) return 0;\n  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;\n  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;\n  return parseFloat(Math.sqrt(variance).toFixed(2));\n}`,
                python: `def solution(values):\n  if not values: return 0\n  import math\n  mean = sum(values) / len(values)\n  variance = sum((x - mean) ** 2 for x in values) / len(values)\n  return round(math.sqrt(variance), 2)`,
            },
            inputFormat: 'values (number[])',
            outputFormat: 'number (standard deviation rounded to 2 decimals)',
            sampleTestCases: [
                { input: '[10, 12, 23, 23, 16, 23, 21, 16]', expectedOutput: '4.9', explanation: 'Mean is 18; variance is 24; sqrt is ~4.90.' },
                { input: '[5, 5, 5, 5]', expectedOutput: '0', explanation: 'All elements equal; standard deviation is 0.' },
            ],
            hiddenTestCases: [
                { input: '[2, 4, 4, 4, 5, 5, 7, 9]', expectedOutput: '2', explanation: 'Variance is 4, standard deviation is exactly 2.' },
                { input: '[1, 2, 3]', expectedOutput: '0.82', explanation: 'Standard deviation of 1, 2, 3 is ~0.82.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 8. Advanced SQL & Relational Database Design
    'advanced-sql-and-relational-database-design': [
        {
            title: 'Find Second Highest Salary',
            problemStatement: 'Write an algorithm or query simulation `solution(salaries)` that returns the second highest distinct salary from an array of employee salary numbers. If no second highest salary exists (e.g. fewer than 2 distinct salaries), return `null`.',
            difficulty: 'Easy',
            topicTags: ['SQL', 'Databases', 'Algorithms', 'Distinct'],
            supportedLanguages: ['javascript', 'python', 'sql'],
            starterCode: {
                javascript: `function solution(salaries) {\n  const unique = Array.from(new Set(salaries)).sort((a, b) => b - a);\n  return unique.length >= 2 ? unique[1] : null;\n}`,
                python: `def solution(salaries):\n  unique = sorted(list(set(salaries)), reverse=True)\n  return unique[1] if len(unique) >= 2 else None`,
                sql: `SELECT MAX(salary) AS SecondHighestSalary FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);`,
            },
            inputFormat: 'salaries (number[])',
            outputFormat: 'number or null',
            sampleTestCases: [
                { input: '[100, 200, 300]', expectedOutput: '200', explanation: '300 is highest, 200 is second highest.' },
                { input: '[100, 100]', expectedOutput: 'null', explanation: 'Only one distinct salary exists, returns null.' },
            ],
            hiddenTestCases: [
                { input: '[500, 200, 500, 400]', expectedOutput: '400', explanation: 'Ignores duplicates of top salary and picks 400.' },
                { input: '[50]', expectedOutput: 'null', explanation: 'Single salary returns null.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Department Top Earners Window Query',
            problemStatement: 'In enterprise database reporting, analytical queries find top earners per department using window ranking functions. Write the standard SQL query that returns the department name, employee name, and salary for employees who have the top salary in their department.',
            difficulty: 'Medium',
            topicTags: ['SQL', 'Window Functions', 'DENSE_RANK', 'JOIN'],
            supportedLanguages: ['sql', 'javascript'],
            starterCode: {
                sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n  SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId\n);`,
                javascript: `function solution() {\n  return "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);";\n}`,
            },
            inputFormat: 'none',
            outputFormat: 'SQL Query String',
            sampleTestCases: [
                { input: '""', expectedOutput: '"SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);"', explanation: 'Executes valid window aggregation SQL.' },
            ],
            hiddenTestCases: [
                { input: '"test"', expectedOutput: '"SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);"', explanation: 'SQL query structure confirmed.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 9. Data Structures and Algorithms Masterclass
    'data-structures-and-algorithms-masterclass': [
        {
            title: 'Two Sum Problem',
            problemStatement: 'Given an array of integers `nums` and an integer `target`, write a function `solution(nums, target)` that returns the 0-based indices of the two numbers such that they add up to `target`. Assume each input has exactly one solution, and do not use the same element twice. Return indices in ascending order `[i, j]`.',
            difficulty: 'Easy',
            topicTags: ['Algorithms', 'Hash Table', 'Arrays', 'Two Pointers'],
            supportedLanguages: ['javascript', 'python', 'java'],
            starterCode: {
                javascript: `function solution(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
                python: `def solution(nums, target):\n  lookup = {}\n  for i, num in enumerate(nums):\n    comp = target - num\n    if comp in lookup:\n      return [lookup[comp], i]\n    lookup[num] = i\n  return []`,
                java: `public class Solution {\n    public int[] solution(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
            },
            inputFormat: 'nums (number[]), target (number)',
            outputFormat: 'number[] (array of two indices [i, j])',
            sampleTestCases: [
                { input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
                { input: '[[3, 2, 4], 6]', expectedOutput: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6.' },
            ],
            hiddenTestCases: [
                { input: '[[3, 3], 6]', expectedOutput: '[0,1]', explanation: 'Pair of duplicate numbers.' },
                { input: '[[-1, -2, -3, -4, -5], -8]', expectedOutput: '[2,4]', explanation: 'Negative numbers [-3, -5] = -8.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Valid Parentheses Matching',
            problemStatement: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, write a function `solution(s)` that determines if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
            difficulty: 'Easy',
            topicTags: ['Algorithms', 'Stack', 'Strings'],
            supportedLanguages: ['javascript', 'python', 'java'],
            starterCode: {
                javascript: `function solution(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else if (map[char]) {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
                python: `def solution(s):\n  stack = []\n  mapping = {')': '(', '}': '{', ']': '['}\n  for char in s:\n    if char in '({[':\n      stack.append(char)\n    elif char in mapping:\n      if not stack or stack.pop() != mapping[char]:\n        return False\n  return len(stack) == 0`,
                java: `public class Solution {\n    public boolean solution(String s) {\n        java.util.Stack<Character> stack = new java.util.Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
            },
            inputFormat: 's (string)',
            outputFormat: 'boolean',
            sampleTestCases: [
                { input: '"()"', expectedOutput: 'true', explanation: 'Simple matching parentheses.' },
                { input: '"()[]{}"', expectedOutput: 'true', explanation: 'Multiple valid consecutive pairs.' },
            ],
            hiddenTestCases: [
                { input: '"(]"', expectedOutput: 'false', explanation: 'Mismatched closing bracket.' },
                { input: '"{[]}"', expectedOutput: 'true', explanation: 'Properly nested brackets.' },
            ],
            isRequired: true,
            order: 2,
        },
        {
            title: 'Merge Two Sorted Arrays',
            problemStatement: 'Given two sorted integer arrays `nums1` and `nums2`, write a function `solution(nums1, nums2)` that merges them into a single sorted array in non-decreasing order.',
            difficulty: 'Easy',
            topicTags: ['Algorithms', 'Arrays', 'Two Pointers', 'Sorting'],
            supportedLanguages: ['javascript', 'python', 'java'],
            starterCode: {
                javascript: `function solution(nums1, nums2) {\n  const merged = [];\n  let i = 0, j = 0;\n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);\n    else merged.push(nums2[j++]);\n  }\n  while (i < nums1.length) merged.push(nums1[i++]);\n  while (j < nums2.length) merged.push(nums2[j++]);\n  return merged;\n}`,
                python: `def solution(nums1, nums2):\n  i, j = 0, 0\n  res = []\n  while i < len(nums1) and j < len(nums2):\n    if nums1[i] <= nums2[j]:\n      res.append(nums1[i])\n      i += 1\n    else:\n      res.append(nums2[j])\n      j += 1\n  res.extend(nums1[i:])\n  res.extend(nums2[j:])\n  return res`,
                java: `public class Solution {\n    public int[] solution(int[] nums1, int[] nums2) {\n        int[] res = new int[nums1.length + nums2.length];\n        int i = 0, j = 0, k = 0;\n        while (i < nums1.length && j < nums2.length) {\n            if (nums1[i] <= nums2[j]) res[k++] = nums1[i++];\n            else res[k++] = nums2[j++];\n        }\n        while (i < nums1.length) res[k++] = nums1[i++];\n        while (j < nums2.length) res[k++] = nums2[j++];\n        return res;\n    }\n}`,
            },
            inputFormat: 'nums1 (number[]), nums2 (number[])',
            outputFormat: 'number[] (merged sorted array)',
            sampleTestCases: [
                { input: '[[1, 2, 4], [1, 3, 4]]', expectedOutput: '[1,1,2,3,4,4]', explanation: 'Merges two 3-element sorted arrays.' },
                { input: '[[], [0]]', expectedOutput: '[0]', explanation: 'Merges empty array with single-element array.' },
            ],
            hiddenTestCases: [
                { input: '[[2, 5, 8], [1, 3, 9, 10]]', expectedOutput: '[1,2,3,5,8,9,10]', explanation: 'Handles arrays of differing lengths.' },
                { input: '[[-5, -2, 0], [-3, 1]]', expectedOutput: '[-5,-3,-2,0,1]', explanation: 'Correctly orders negative and positive numbers.' },
            ],
            isRequired: true,
            order: 3,
        },
    ],
    // 10. Technical Interview Preparation Bootcamp
    'technical-interview-preparation-bootcamp': [
        {
            title: 'Valid Anagram Check',
            problemStatement: 'Given two strings `s` and `t`, write a function `solution(s, t)` that returns `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is formed by rearranging the letters of another word using all original letters exactly once.',
            difficulty: 'Easy',
            topicTags: ['Interview Prep', 'Strings', 'Hash Table', 'Sorting'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}`,
                python: `def solution(s, t):\n  if len(s) != len(t): return False\n  from collections import Counter\n  return Counter(s) == Counter(t)`,
            },
            inputFormat: 's (string), t (string)',
            outputFormat: 'boolean',
            sampleTestCases: [
                { input: '["anagram", "nagaram"]', expectedOutput: 'true', explanation: 'nagaram uses the exact letters of anagram.' },
                { input: '["rat", "car"]', expectedOutput: 'false', explanation: 'Different letter sets.' },
            ],
            hiddenTestCases: [
                { input: '["listen", "silent"]', expectedOutput: 'true', explanation: 'Valid english anagram pair.' },
                { input: '["a", "ab"]', expectedOutput: 'false', explanation: 'Differing string lengths cannot be anagrams.' },
            ],
            isRequired: true,
            order: 1,
        },
        {
            title: 'Longest Substring Without Repeating Characters',
            problemStatement: 'Given a string `s`, find the length of the longest substring without duplicate characters using the sliding window technique. Return the integer length.',
            difficulty: 'Medium',
            topicTags: ['Interview Prep', 'Sliding Window', 'Strings', 'Hash Map'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(s) {\n  let maxLen = 0;\n  let left = 0;\n  const seen = new Map();\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (seen.has(char) && seen.get(char) >= left) {\n      left = seen.get(char) + 1;\n    }\n    seen.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
                python: `def solution(s):\n  seen = {}\n  max_len = 0\n  left = 0\n  for right, c in enumerate(s):\n    if c in seen and seen[c] >= left:\n      left = seen[c] + 1\n    seen[c] = right\n    max_len = max(max_len, right - left + 1)\n  return max_len`,
            },
            inputFormat: 's (string)',
            outputFormat: 'number (maximum substring length)',
            sampleTestCases: [
                { input: '"abcabcbb"', expectedOutput: '3', explanation: 'Longest substring without repeating characters is "abc" with length 3.' },
                { input: '"bbbbb"', expectedOutput: '1', explanation: 'Longest substring is "b" with length 1.' },
            ],
            hiddenTestCases: [
                { input: '"pwwkew"', expectedOutput: '3', explanation: 'The answer is "wke" with length 3.' },
                { input: '""', expectedOutput: '0', explanation: 'Empty string has length 0.' },
            ],
            isRequired: true,
            order: 2,
        },
    ],
    // 11. Foundations of Artificial Intelligence
    'foundations-of-artificial-intelligence': [
        {
            title: 'Shortest Path Distance via BFS',
            problemStatement: 'Implement a function `solution(adjList, startNode, endNode)` that computes the minimum number of edges between `startNode` and `endNode` in an unweighted graph using Breadth-First Search (BFS). If no path exists, return `-1`.',
            difficulty: 'Medium',
            topicTags: ['Artificial Intelligence', 'Graph Search', 'BFS', 'Pathfinding'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(adjList, startNode, endNode) {\n  if (startNode === endNode) return 0;\n  const visited = new Set([startNode]);\n  const queue = [[startNode, 0]];\n  while (queue.length > 0) {\n    const [current, dist] = queue.shift();\n    const neighbors = adjList[current] || [];\n    for (const neighbor of neighbors) {\n      if (neighbor === endNode) return dist + 1;\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push([neighbor, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
                python: `def solution(adj_list, start_node, end_node):\n  if start_node == end_node: return 0\n  from collections import deque\n  visited = {start_node}\n  q = deque([(start_node, 0)])\n  while q:\n    curr, dist = q.popleft()\n    for neighbor in adj_list.get(curr, []):\n      if neighbor == end_node: return dist + 1\n      if neighbor not in visited:\n        visited.add(neighbor)\n        q.append((neighbor, dist + 1))\n  return -1`,
            },
            inputFormat: 'adjList (object mapping node names to neighbor arrays), startNode (string), endNode (string)',
            outputFormat: 'number (shortest edge distance or -1)',
            sampleTestCases: [
                { input: '[{"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}, "A", "D"]', expectedOutput: '2', explanation: 'Path A -> B -> D has length 2 edges.' },
                { input: '[{"A": ["B"], "B": [], "C": []}, "A", "C"]', expectedOutput: '-1', explanation: 'No path exists between A and C.' },
            ],
            hiddenTestCases: [
                { input: '[{"S": ["A"], "A": ["B"], "B": ["G"], "G": []}, "S", "G"]', expectedOutput: '3', explanation: 'Linear chain distance is 3 edges.' },
                { input: '[{"A": []}, "A", "A"]', expectedOutput: '0', explanation: 'Start node equals end node; distance is 0.' },
            ],
            isRequired: true,
            order: 1,
        },
    ],
    // 12. Operating Systems Principles & Concurrency
    'operating-systems-principles-and-concurrency': [
        {
            title: 'Round Robin CPU Scheduling Simulation',
            problemStatement: 'Implement a function `solution(burstTimes, quantum)` that simulates Round Robin CPU scheduling for a set of processes arriving at time 0 with given CPU burst times. Return an array of turnaround/completion times for each process in original process order.',
            difficulty: 'Medium',
            topicTags: ['Operating Systems', 'CPU Scheduling', 'Round Robin', 'Queues'],
            supportedLanguages: ['javascript', 'python'],
            starterCode: {
                javascript: `function solution(burstTimes, quantum) {\n  const n = burstTimes.length;\n  const remaining = [...burstTimes];\n  const completion = new Array(n).fill(0);\n  let time = 0;\n  let finished = 0;\n  while (finished < n) {\n    for (let i = 0; i < n; i++) {\n      if (remaining[i] > 0) {\n        const executeTime = Math.min(quantum, remaining[i]);\n        time += executeTime;\n        remaining[i] -= executeTime;\n        if (remaining[i] === 0) {\n          completion[i] = time;\n          finished++;\n        }\n      }\n    }\n  }\n  return completion;\n}`,
                python: `def solution(burst_times, quantum):\n  n = len(burst_times)\n  remaining = list(burst_times)\n  completion = [0] * n\n  time = 0\n  finished = 0\n  while finished < n:\n    for i in range(n):\n      if remaining[i] > 0:\n        exec_time = min(quantum, remaining[i])\n        time += exec_time\n        remaining[i] -= exec_time\n        if remaining[i] == 0:\n          completion[i] = time\n          finished += 1\n  return completion`,
            },
            inputFormat: 'burstTimes (number[]), quantum (number)',
            outputFormat: 'number[] (completion times in order)',
            sampleTestCases: [
                { input: '[[5, 3, 8], 2]', expectedOutput: '[12,7,16]', explanation: 'Simulates processes running in slices of 2 units until completion.' },
                { input: '[[2, 4], 2]', expectedOutput: '[2,6]', explanation: 'P0 completes at time 2; P1 finishes at time 6.' },
            ],
            hiddenTestCases: [
                { input: '[[10], 5]', expectedOutput: '[10]', explanation: 'Single process runs to completion in 10 time units.' },
                { input: '[[1, 1, 1], 1]', expectedOutput: '[1,2,3]', explanation: 'Unit length jobs finish consecutively.' },
            ],
            isRequired: true,
            order: 1,
        },
    ],
};
