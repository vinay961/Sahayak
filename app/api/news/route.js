import dbConnect from "@/lib/db";
import News from "@/model/news";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const newsItem = await News.findById(id);
            if (!newsItem) {
                return new Response(JSON.stringify({ error: 'News not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
            }
            return new Response(JSON.stringify(newsItem), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        else {
            const newsItems = await News.find();
            return new Response(JSON.stringify(newsItems), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch news' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        await dbConnect();
        // const newNews = await News.create(body); // This is a shorthand for creating and saving a new document in one step.
        const newNews = new News(body); // This is a two-step process: first creating a new instance of the model, then saving it to the database.
        await newNews.save();
        return new Response(JSON.stringify({ success: true }), { status: 201, headers: { 
            'Content-Type': 'application/json'
        }});
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to create news' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}


