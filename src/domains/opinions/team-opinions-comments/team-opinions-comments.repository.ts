import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/database/firebase/firebase.service';

@Injectable()
export class TeamOpinionsCommentsRepository {
    private teamOpinionsCollection: FirebaseFirestore.CollectionReference;

    constructor(private firebaseService: FirebaseService) {}

    async onModuleInit() {
        this.teamOpinionsCollection = this.firebaseService.teamOpinionsCollection;
    }

    // -------------------------- Team Opinions --------------------------//

    async createOpinion(opinion: any): Promise<any> {
        const plainOpinion = JSON.parse(JSON.stringify(opinion));
        const docRef = await this.teamOpinionsCollection.add(plainOpinion);
        return { id: docRef.id, ...opinion };
    }

    async getOpinionById(id: string): Promise<any> {
        const doc = await this.teamOpinionsCollection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    async getOpinions(): Promise<any[]> {
        const snapshot = await this.teamOpinionsCollection.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async getOpinionsByTeamId(teamId: string): Promise<any[]> {
        const snapshot = await this.teamOpinionsCollection.where('team_id', '==', teamId).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async updateOpinion(id: string, opinion: any): Promise<any> {
        const plainOpinion = JSON.parse(JSON.stringify(opinion));
        await this.teamOpinionsCollection.doc(id).update(plainOpinion);
        return { id, ...opinion };
    }

    async deleteOpinion(id: string): Promise<any> {
        const docRef = this.teamOpinionsCollection.doc(id);
        const docSnapshot = await docRef.get();
        const deletedID = docSnapshot.id;
        const deletedData = docSnapshot.data();
        await docRef.delete();
        return { id: deletedID, ...deletedData };
    }

    // -------------------------- Team Comments --------------------------//

    async addComment(opinionId: string, comment: any): Promise<any> {
        const plainComment = JSON.parse(JSON.stringify(comment));
        const commentsRef = this.teamOpinionsCollection.doc(opinionId).collection('comments');
        return commentsRef.add(plainComment);
    }

    async getCommentsForOpinion(opinionId: string): Promise<any[]> {
        const snapshot = await this.teamOpinionsCollection.doc(opinionId).collection('comments').get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async getCommentByIdForOpinion(opinionId: string, commentId: string): Promise<any> {
        const commentRef = this.teamOpinionsCollection.doc(opinionId).collection('comments').doc(commentId);
        const commentSnapshot = await commentRef.get();
        return commentSnapshot.exists ? { id: commentSnapshot.id, ...commentSnapshot.data() } : null;
    }

    async updateComment(opinionId: string, commentId: string, comment: any): Promise<any> {
        const plainComment = JSON.parse(JSON.stringify(comment));
        await this.teamOpinionsCollection.doc(opinionId).collection('comments').doc(commentId).update(plainComment);
        return { id: commentId, ...comment };
    }

    async deleteComment(opinionId: string, commentId: string): Promise<any> {
        const commentRef = this.teamOpinionsCollection.doc(opinionId).collection('comments').doc(commentId);
        const commentSnapshot = await commentRef.get();
        const deletedID = commentSnapshot.id;
        const deletedData = commentSnapshot.data();
        await commentRef.delete();
        return { id: deletedID, ...deletedData };
    }
}
