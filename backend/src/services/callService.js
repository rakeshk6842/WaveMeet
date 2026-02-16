/**
 * Voice/Video Call Service
 * Handles WebRTC peer connections and call management
 */

import { v4 as uuidv4 } from 'uuid';

export class CallService {
  constructor(io) {
    this.io = io;
    this.activeCalls = new Map();
    this.callQueue = new Map();
  }

  /**
   * Initialize call service with socket handlers
   */
  initializeSocketHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('call:initiate', this.handleCallInitiate.bind(this, socket));
      socket.on('call:accept', this.handleCallAccept.bind(this, socket));
      socket.on('call:reject', this.handleCallReject.bind(this, socket));
      socket.on('call:end', this.handleCallEnd.bind(this, socket));
      socket.on('call:signal', this.handleCallSignal.bind(this, socket));
      socket.on('call:mute-audio', this.handleMuteAudio.bind(this, socket));
      socket.on('call:unmute-audio', this.handleUnmuteAudio.bind(this, socket));
      socket.on('call:mute-video', this.handleMuteVideo.bind(this, socket));
      socket.on('call:unmute-video', this.handleUnmuteVideo.bind(this, socket));
      socket.on('call:screen-share', this.handleScreenShare.bind(this, socket));
      socket.on('disconnect', this.handleCallDisconnect.bind(this, socket));
    });
  }

  /**
   * Handle call initiation
   */
  handleCallInitiate(socket, data) {
    const { callId, calleeId, callType, conversationId } = data;
    const callerId = socket.handshake.auth.userId;

    if (!callId || !calleeId || !callType) {
      return socket.emit('call:error', {
        error: 'Missing required fields',
      });
    }

    const call = {
      callId: callId || uuidv4(),
      callerId,
      calleeId,
      callType, // 'audio' or 'video'
      conversationId,
      status: 'ringing',
      startTime: new Date(),
      participants: [callerId],
    };

    this.activeCalls.set(call.callId, call);

    // Notify callee
    this.io.to(calleeId).emit('call:incoming', {
      callId: call.callId,
      callerId,
      callerName: data.callerName,
      callType: call.callType,
      conversationId,
    });

    // Set call timeout (30 seconds)
    setTimeout(() => {
      if (
        this.activeCalls.get(call.callId)?.status === 'ringing'
      ) {
        this.handleCallReject(socket, { callId: call.callId });
      }
    }, 30000);

    socket.emit('call:initiated', { callId: call.callId });
  }

  /**
   * Handle call acceptance
   */
  handleCallAccept(socket, data) {
    const { callId } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) {
      return socket.emit('call:error', { error: 'Call not found' });
    }

    call.status = 'active';
    call.participants.push(userId);
    call.acceptedAt = new Date();

    // Notify caller
    this.io.to(call.callerId).emit('call:accepted', {
      callId,
      acceptedBy: userId,
    });

    socket.emit('call:accepted-confirmed', { callId });
  }

  /**
   * Handle call rejection
   */
  handleCallReject(socket, data) {
    const { callId, reason } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) {
      return;
    }

    call.status = 'rejected';
    call.rejectedAt = new Date();
    call.rejectedBy = userId;
    call.rejectionReason = reason;

    // Notify caller
    this.io.to(call.callerId).emit('call:rejected', {
      callId,
      rejectedBy: userId,
      reason,
    });

    // Clean up
    setTimeout(() => {
      this.activeCalls.delete(callId);
    }, 5000);
  }

  /**
   * Handle call end
   */
  handleCallEnd(socket, data) {
    const { callId } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) {
      return;
    }

    call.status = 'ended';
    call.endedAt = new Date();
    call.endedBy = userId;
    call.duration = Math.floor(
      (call.endedAt - call.startTime) / 1000
    );

    // Notify all participants
    call.participants.forEach((participantId) => {
      this.io.to(participantId).emit('call:ended', {
        callId,
        duration: call.duration,
        endedBy: userId,
      });
    });

    // Clean up
    setTimeout(() => {
      this.activeCalls.delete(callId);
    }, 5000);

    // Store call history
    this.storeCallHistory(call);
  }

  /**
   * Handle WebRTC signal
   */
  handleCallSignal(socket, data) {
    const { callId, to, signal } = data;
    const from = socket.handshake.auth.userId;

    this.io.to(to).emit('call:signal', {
      callId,
      from,
      signal,
    });
  }

  /**
   * Handle audio mute
   */
  handleMuteAudio(socket, data) {
    const { callId } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) return;

    this.io.to(callId).emit('call:audio-muted', {
      userId,
      callId,
    });
  }

  /**
   * Handle audio unmute
   */
  handleUnmuteAudio(socket, data) {
    const { callId } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) return;

    this.io.to(callId).emit('call:audio-unmuted', {
      userId,
      callId,
    });
  }

  /**
   * Handle video mute
   */
  handleMuteVideo(socket, data) {
    const { callId } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) return;

    this.io.to(callId).emit('call:video-muted', {
      userId,
      callId,
    });
  }

  /**
   * Handle video unmute
   */
  handleUnmuteVideo(socket, data) {
    const { callId } = data;
    const userId = socket.handshake.auth.userId;

    const call = this.activeCalls.get(callId);
    if (!call) return;

    this.io.to(callId).emit('call:video-unmuted', {
      userId,
      callId,
    });
  }

  /**
   * Handle screen sharing
   */
  handleScreenShare(socket, data) {
    const { callId, screenStream } = data;
    const userId = socket.handshake.auth.userId;

    this.io.to(callId).emit('call:screen-share-started', {
      userId,
      callId,
      screenStream,
    });
  }

  /**
   * Handle disconnect
   */
  handleCallDisconnect(socket) {
    // End any active calls for this user
    for (const [callId, call] of this.activeCalls.entries()) {
      if (call.participants.includes(socket.handshake.auth.userId)) {
        this.handleCallEnd(socket, { callId });
      }
    }
  }

  /**
   * Store call history (would be implemented with database)
   */
  storeCallHistory(call) {
    console.log('Storing call history:', {
      callId: call.callId,
      participants: call.participants,
      duration: call.duration,
      type: call.callType,
    });
  }

  /**
   * Get active calls for a user
   */
  getActiveCalls(userId) {
    const userCalls = [];
    for (const [callId, call] of this.activeCalls.entries()) {
      if (call.participants.includes(userId)) {
        userCalls.push(call);
      }
    }
    return userCalls;
  }

  /**
   * Get call history
   */
  getCallHistory(userId, limit = 50) {
    // Would fetch from database
    return [];
  }
}

export default CallService;
