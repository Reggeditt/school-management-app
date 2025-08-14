import { NextResponse } from 'next/server';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function DELETE() {
  try {
    console.log('Starting to delete seed data...');
    
    // Collections to clear
    const collections = [
      'students',
      'teachers',
      'classes',
      'subjects',
      'attendanceRecords',
      'grades',
      'exams',
      'assignments',
      'announcements',
      'users'
    ];

    // Use batch operations for efficient deletion
    const batch = writeBatch(db);
    let totalDeleted = 0;

    // Delete documents from each collection
    for (const collectionName of collections) {
      console.log(`Deleting from ${collectionName}...`);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
    }

    // Commit the batch
    await batch.commit();
    
    console.log(`Successfully deleted ${totalDeleted} documents from Firestore`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${totalDeleted} documents from Firestore. Note: Firebase Auth users remain and will need to be deleted manually if needed.`,
      deletedCollections: collections,
      totalDeleted
    });

  } catch (error) {
    console.error('Error deleting seed data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete seed data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
