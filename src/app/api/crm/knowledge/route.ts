import { NextResponse } from 'next/server';
import { getAllKnowledgeItems, addKnowledgeItem, updateKnowledgeItemStatus } from '@/lib/ai/knowledge-service';

export async function GET() {
  try {
    const items = getAllKnowledgeItems();
    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('Error fetching knowledge items:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, content, source } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Title, category, and content are required' }, { status: 400 });
    }

    const newItem = addKnowledgeItem({
      title,
      category,
      content,
      source: source || 'Admin Entry',
      status: 'ACTIVE',
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding knowledge item:', error);
    return NextResponse.json({ error: 'Failed to add knowledge item' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status || (status !== 'ACTIVE' && status !== 'INACTIVE')) {
      return NextResponse.json({ error: 'Valid ID and status required' }, { status: 400 });
    }

    const updated = updateKnowledgeItemStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Knowledge item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating knowledge item:', error);
    return NextResponse.json({ error: 'Failed to update knowledge status' }, { status: 500 });
  }
}
