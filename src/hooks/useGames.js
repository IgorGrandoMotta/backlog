// src/hooks/useGames.js
import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useGames(userId) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setGames([]); setLoading(false); return; }

    const q = query(
      collection(db, 'games'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setGames(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, [userId]);

  const addGame = (data) =>
    addDoc(collection(db, 'games'), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

  const updateGame = (id, data) =>
    updateDoc(doc(db, 'games', id), { ...data, updatedAt: serverTimestamp() });

  const deleteGame = (id) => deleteDoc(doc(db, 'games', id));

  return { games, loading, addGame, updateGame, deleteGame };
}
