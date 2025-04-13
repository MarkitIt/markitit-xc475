import { db } from './firebase'; 
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc
} from 'firebase/firestore';

export interface Message {
  id?: string;
  senderId: string;
  text: string;
  timestamp: any;
  read: boolean;
}

// for single vs community chat
export interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: any;
  type: 'personal' | 'community';
  name?: string;
  memberCount?: number; 
  createdBy?: string;
}

export interface UserChat {
  userId: string;
  conversationIds: string[];
}

// create chat for 2 users
export const createPersonalChat = async (user1Id: string, user2Id: string) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', user1Id),
      where('type', '==', 'personal')
    );
    
    const querySnapshot = await getDocs(q);
    let existingConversation = null;
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.participants.includes(user2Id)) {
        existingConversation = { id: doc.id, ...data };
      }
    });
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // create new if don't exist
    const newConversation = {
      participants: [user1Id, user2Id],
      type: 'personal',
      lastMessageTimestamp: serverTimestamp(),
    };
    
    const conversationRef = await addDoc(collection(db, 'conversations'), newConversation);

    await updateUserChats(user1Id, conversationRef.id);
    await updateUserChats(user2Id, conversationRef.id);
    
    return { id: conversationRef.id, ...newConversation };
  } catch (error) {
    console.error('Error creating personal chat:', error);
    throw error;
  }
};

// new community chat
export const createCommunityChat = async (name: string, creatorId: string, initialMembers: string[] = []) => {
  try {
    const members = [creatorId, ...initialMembers];
    
    const newCommunity = {
      participants: members,
      type: 'community',
      name,
      memberCount: members.length,
      createdBy: creatorId,
      lastMessageTimestamp: serverTimestamp(),
    };
    
    const communityRef = await addDoc(collection(db, 'conversations'), newCommunity);
    
    for (const memberId of members) {
      await updateUserChats(memberId, communityRef.id);
    }
    
    return { id: communityRef.id, ...newCommunity };
  } catch (error) {
    console.error('Error creating community chat:', error);
    throw error;
  }
};

// update user chat
const updateUserChats = async (userId: string, conversationId: string) => {
  const userChatRef = doc(db, 'userChats', userId);
  
  try {
    const docSnap = await getDoc(userChatRef);
    
    if (docSnap.exists()) {
      await updateDoc(userChatRef, {
        conversationIds: arrayUnion(conversationId)
      });
    } else {
      await setDoc(userChatRef, {
        userId,
        conversationIds: [conversationId]
      });
    }
  } catch (error) {
    console.error('Error updating userChats:', error);
    throw error;
  }
};

export const sendMessage = async (conversationId: string, senderId: string, text: string) => {
  try {
    const message = {
      senderId,
      text,
      timestamp: serverTimestamp(),
      read: false,
    };
    
    const messageRef = await addDoc(
      collection(db, 'conversations', conversationId, 'messages'),
      message
    );
    
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
    });
    
    return { id: messageRef.id, ...message };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// get all chat for this user
export const getUserChats = (userId: string, callback: (chats: Conversation[]) => void) => {
  try {
    const userChatsRef = doc(db, 'userChats', userId);
    
    return onSnapshot(userChatsRef, (userChatsDoc) => {
      if (!userChatsDoc.exists()) {
        callback([]);
        return;
      }
      
      const userChatsData = userChatsDoc.data() as UserChat;
      const conversationIds = userChatsData.conversationIds || [];
      
      if (conversationIds.length === 0) {
        callback([]);
        return;
      }

      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTimestamp', 'desc')
      );
      
      return onSnapshot(q, (querySnapshot) => {
        const conversations: Conversation[] = [];
        querySnapshot.forEach((doc) => {
          conversations.push({ id: doc.id, ...doc.data() as Conversation });
        });
        
        callback(conversations);
      });
    });
  } catch (error) {
    console.error('Error getting user chats:', error);
    callback([]);
    throw error;
  }
};

export const getConversationMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
) => {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() as Message });
      });
      
      callback(messages);
    });
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    callback([]);
    throw error;
  }
};

export const joinCommunityChat = async (conversationId: string, userId: string) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      throw new Error('Conversation does not exist');
    }
    
    const conversationData = conversationSnap.data() as Conversation;
    
    if (conversationData.type !== 'community') {
      throw new Error('This is not a community chat');
    }
    
    if (conversationData.participants.includes(userId)) {
      return;
    }
    
    await updateDoc(conversationRef, {
      participants: arrayUnion(userId),
      memberCount: (conversationData.memberCount || 0) + 1
    });
    
    // Update userChats
    await updateUserChats(userId, conversationId);
  } catch (error) {
    console.error('Error joining community chat:', error);
    throw error;
  }
};