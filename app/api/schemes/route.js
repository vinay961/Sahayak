import dbConnect from "@/lib/db";
import Scheme from "@/model/scheme";

export async function GET(request) {
    try {
        await dbConnect();
        const schemes = await Scheme.find();
        return new Response(JSON.stringify(schemes), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch schemes' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        await dbConnect();
        const newScheme = new Scheme(body);
        await newScheme.save();
        return new Response(JSON.stringify({ success: true }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to create scheme' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
