import axios from "axios";
(async () => {
    try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log(res.data.userId);
        const res2 = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            title: 'foo',
            body: 'bar',
            userId: 1,
        });
        console.log(res2.data.id);
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data.message);
        }
    }
})();
