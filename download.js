const fs = require('fs');
const https = require('https');

const urls = [
  { name: 'landing.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA3NmI4ODQ2ZDhjYTRhMjU5YTFjYWViYjlmNzBkNWVhEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'profile.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzY2NjQ4Yzk3MDZhODQ3YjhiZDQ5NzljZDc5NDdmMWNmEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'dashboard.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZiMDJiMTJkYmQyODQzNWY4ZTNiMGZkNzM1ZTEyMGJhEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'focused_notes.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2VkMGZlMDE5NTVkYjQ0NWJiMjgyMGI3MDg2MWU4ZWE2EgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'ai_quiz.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZjYmQ3YWU1NjZjOTQ3ZTQ4NDI4NjNmOTM3MTNjZTAyEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'course_details.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzcwZDIyYTRmN2NjYzQ5Y2NiMjQ4MzlmZDg3ZjA3MThlEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'course_catalog.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzBjYjE1YWJjYjc5NDRkZDdiODNmZTUyNmFiOGYzODdhEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'ai_course_gen.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzg4MDY3OTU0MDE2OTQ2MDhhYzIwMzdjZTNiYTRkZmFlEgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" },
  { name: 'settings.html', url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFmMTM0ZmE1MzljNzRlMjk4OWYwZGI0YTEzNzcxNDY5EgsSBxDHu4GT8AwYAZIBIwoKcHJvamVjdF9pZBIVQhM4NDA2NjAyMTQwNTE2MzQ5OTY0&filename=&opi=89354086" }
];

if (!fs.existsSync('tmp_stitch')) fs.mkdirSync('tmp_stitch');

urls.forEach(u => {
  https.get(u.url, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => { fs.writeFileSync('tmp_stitch/' + u.name, rawData); });
  });
});
