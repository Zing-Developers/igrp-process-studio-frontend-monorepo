import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/server-client';

export async function GET(request: NextRequest) {
  try {
    // Get all process definitions using the server-side client
    const processDefinitions = await serverClient.processDefinitions.getAll();
    
    return NextResponse.json({
      success: true,
      data: processDefinitions,
    });
  } catch (error) {
    console.error('Error fetching process definitions:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch process definitions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, ...processDefinition } = body;
    
    // Create a new process definition using the server-side client
    const newProcessDefinition = await serverClient.processDefinitions.create(
      projectId,
      processDefinition
    );
    
    return NextResponse.json({
      success: true,
      data: newProcessDefinition,
    });
  } catch (error) {
    console.error('Error creating process definition:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create process definition',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
