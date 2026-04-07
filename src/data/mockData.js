// src/data/mockData.js

export const PROBLEMS = [
  { id: 1, num: 1, title: "Two Sum", tag: "array", diff: "easy", acc: "49.1%", solved: true },
  { id: 2, num: 2, title: "Add Two Numbers", tag: "dp", diff: "medium", acc: "40.3%", solved: true },
  { id: 3, num: 3, title: "Longest Substring No Repeat", tag: "string", diff: "medium", acc: "33.7%", solved: false },
  { id: 4, num: 4, title: "Median of Two Sorted Arrays", tag: "array", diff: "hard", acc: "37.8%", solved: false },
  { id: 5, num: 5, title: "Longest Palindromic Substr", tag: "string", diff: "medium", acc: "32.5%", solved: true },
  { id: 6, num: 21, title: "Merge Two Sorted Lists", tag: "dp", diff: "easy", acc: "61.4%", solved: false },
  { id: 7, num: 42, title: "Trapping Rain Water", tag: "array", diff: "hard", acc: "58.2%", solved: false },
  { id: 8, num: 53, title: "Maximum Subarray", tag: "dp", diff: "medium", acc: "49.5%", solved: true },
  { id: 9, num: 70, title: "Climbing Stairs", tag: "dp", diff: "easy", acc: "51.7%", solved: true },
  { id: 10, num: 98, title: "Validate BST", tag: "tree", diff: "medium", acc: "30.2%", solved: false },
  { id: 11, num: 124, title: "Binary Tree Max Path Sum", tag: "tree", diff: "hard", acc: "38.9%", solved: false },
  { id: 12, num: 200, title: "Number of Islands", tag: "graph", diff: "medium", acc: "55.1%", solved: true },
  { id: 13, num: 207, title: "Course Schedule", tag: "graph", diff: "medium", acc: "45.8%", solved: false },
  { id: 14, num: 300, title: "Longest Increasing Subsequence", tag: "dp", diff: "medium", acc: "50.4%", solved: false },
  { id: 15, num: 322, title: "Coin Change", tag: "dp", diff: "medium", acc: "41.2%", solved: true },
  { id: 16, num: 347, title: "Top K Frequent Elements", tag: "hash", diff: "medium", acc: "64.3%", solved: false },
  { id: 17, num: 560, title: "Subarray Sum Equals K", tag: "hash", diff: "medium", acc: "43.1%", solved: false },
  { id: 18, num: 739, title: "Daily Temperatures", tag: "array", diff: "medium", acc: "66.2%", solved: true },
];

export const SUBMISSIONS = [
  { id: "s1", problem: "Two Sum", problemId: 1, lang: "Java", verdict: "AC", time: "48ms", mem: "42.1 MB", date: "2h ago" },
  { id: "s2", problem: "Climbing Stairs", problemId: 9, lang: "Python", verdict: "AC", time: "32ms", mem: "16.2 MB", date: "5h ago" },
  { id: "s3", problem: "Maximum Subarray", problemId: 8, lang: "Java", verdict: "WA", time: "—", mem: "—", date: "1d ago" },
  { id: "s4", problem: "Number of Islands", problemId: 12, lang: "C++", verdict: "TLE", time: ">2000ms", mem: "—", date: "2d ago" },
  { id: "s5", problem: "Longest Palindromic", problemId: 5, lang: "Java", verdict: "AC", time: "112ms", mem: "48.4 MB", date: "3d ago" },
  { id: "s6", problem: "Add Two Numbers", problemId: 2, lang: "Python", verdict: "RE", time: "—", mem: "—", date: "4d ago" },
  { id: "s7", problem: "Coin Change", problemId: 15, lang: "Java", verdict: "AC", time: "18ms", mem: "40.6 MB", date: "5d ago" },
  { id: "s8", problem: "Daily Temperatures", problemId: 18, lang: "Java", verdict: "AC", time: "6ms", mem: "48.2 MB", date: "6d ago" },
  { id: "s9", problem: "Two Sum", problemId: 1, lang: "JavaScript", verdict: "WA", time: "—", mem: "—", date: "7d ago" },
  { id: "s10", problem: "Climbing Stairs", problemId: 9, lang: "C++", verdict: "AC", time: "0ms", mem: "5.8 MB", date: "8d ago" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Siva Devireddy", handle: "siva_devireddy", score: 4820, solved: 156, streak: 42, color: "#7c6dfa" },
  { rank: 2, name: "Priya Nair", handle: "priya_n", score: 4610, solved: 149, streak: 35, color: "#3fb950" },
  { rank: 3, name: "Rishi Kapoor", handle: "rishiK", score: 4390, solved: 138, streak: 28, color: "#d29922" },
  { rank: 4, name: "Meera Iyer", handle: "meera_i", score: 4120, solved: 132, streak: 21, color: "#58a6ff" },
  { rank: 5, name: "Dev Patel", handle: "devp99", score: 3980, solved: 126, streak: 19, color: "#f85149" },
  { rank: 6, name: "Kavya Reddy", handle: "kavyaR", score: 3740, solved: 119, streak: 14, color: "#bc8cff" },
  { rank: 7, name: "Aditya Kumar", handle: "adityaK", score: 3560, solved: 113, streak: 11, color: "#39d353" },
  { rank: 8, name: "Sneha Bose", handle: "sneha_b", score: 3310, solved: 104, streak: 8, color: "#fb7185" },
  { rank: 9, name: "Rahul Verma", handle: "rahulV", score: 3080, solved: 96, streak: 6, color: "#a3e635" },
  { rank: 10, name: "Ananya Singh", handle: "ananya_s", score: 2950, solved: 91, streak: 5, color: "#fdba74" },
];

export const STARTER_CODE = {
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{ map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < (int)nums.size(); i++) {
            int comp = target - nums[i];
            if (mp.count(comp)) return {mp[comp], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp), i];
        map.set(nums[i], i);
    }
    return [];
};`,
};

export const PROBLEM_DETAIL = {
  description: [
    "Given an array of integers <strong>nums</strong> and an integer <strong>target</strong>, return <em>indices</em> of the two numbers such that they add up to <code>target</code>.",
    "You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.",
    "You can return the answer in any order.",
  ],
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
    { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: null },
  ],
  constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists."],
  editorial: {
    approach: "Optimal: Hash Map — O(n) Time, O(n) Space",
    body: [
      "We iterate through the array once. For each element, we check if its complement (<code>target - nums[i]</code>) already exists in our hash map.",
      "If found, we immediately return both indices. Otherwise, we store the current element and its index in the map.",
      "This avoids the O(n²) brute force by trading linear space for a single linear scan.",
    ],
    complexity: { time: "O(n)", space: "O(n)" },
  },
};