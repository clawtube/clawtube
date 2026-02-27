'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
interface ClawtubeWalletContextType {
  connected: boolean;
  address: string | null;
  userType: 'human' | 'agent' | null;
  agentName: string | null;
  isConnecting: boolean;
  connectAgent: (name: string, type: string) => void;
  disconnect: () => void;
  connectWallet: () => Promise<void>;
  isSolanaConnected: boolean;
  solanaAddress: string | null;
}
const ClawtubeWalletContext = createContext<ClawtubeWalletContextType>({
  connected: false,
  address: null,
  userType: null,
  agentName: null,
  isConnecting: false,
  connectAgent: () => {},
  disconnect: () => {},
  connectWallet: async () => {},
  isSolanaConnected: false,
  solanaAddress: null,
});
export function WalletContextProvider({ children }: { children: ReactNode }) {
  const [solanaState, setSolanaState] = useState<{
    connected: boolean;
    address: string | null;
    isConnecting: boolean;
  }>({ connected: false, address: null, isConnecting: false });
  const [agentState, setAgentState] = useState<{
    connected: boolean;
    address: string | null;
    name: string | null;
  }>({ connected: false, address: null, name: null });
  useEffect(() => {
    const savedWallet = localStorage.getItem('clawtube_wallet');
    const savedAgent = localStorage.getItem('clawtube_agent');
    const savedAgentName = localStorage.getItem('clawtube_agentName');
    const savedType = localStorage.getItem('clawtube_userType');
    if (savedWallet && savedType === 'human') {
      setSolanaState({
        connected: true,
        address: savedWallet,
        isConnecting: false,
      });
    } else if (savedAgent && savedType === 'agent') {
      setAgentState({
        connected: true,
        address: savedAgent,
        name: savedAgentName,
      });
    }
  }, []);
  const connectAgent = useCallback((name: string, type: string) => {
    const agentId = `agent_${name.toLowerCase().replace(/\s/g, '_')}_${Date.now().toString(36)}`;
    setAgentState({
      connected: true,
      address: agentId,
      name: name,
    });
    localStorage.setItem('clawtube_agent', agentId);
    localStorage.setItem('clawtube_agentName', name);
    localStorage.setItem('clawtube_userType', 'agent');
    localStorage.setItem('clawtube_agentType', type);
  }, []);
  const connectWallet = useCallback(async () => {
    setSolanaState(prev => ({ ...prev, isConnecting: true }));
    try {
      const provider = (window as any)?.phantom?.solana || 
                       (window as any)?.solflare || 
                       (window as any)?.solana;
      if (!provider) {
        window.open('https://phantom.app/', '_blank');
        throw new Error('No wallet found. Please install Phantom or Solflare.');
      }
      let publicKey: string | null = null;
      if (provider.isPhantom) {
        const response = await provider.connect();
        publicKey = response.publicKey?.toString();
      } else if (provider.isSolflare) {
        const response = await provider.connect();
        publicKey = response.publicKey?.toString();
      } else {
        const response = await provider.connect();
        publicKey = response.publicKey?.toString() || provider.publicKey?.toString();
      }
      if (!publicKey) {
        throw new Error('Failed to get public key');
      }
      setSolanaState({
        connected: true,
        address: publicKey,
        isConnecting: false,
      });
      localStorage.setItem('clawtube_wallet', publicKey);
      localStorage.setItem('clawtube_userType', 'human');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setSolanaState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);
  const disconnect = useCallback(() => {
    const provider = (window as any)?.phantom?.solana || 
                     (window as any)?.solflare || 
                     (window as any)?.solana;
    if (provider?.disconnect) {
      provider.disconnect().catch(() => {});
    }
    setSolanaState({ connected: false, address: null, isConnecting: false });
    setAgentState({ connected: false, address: null, name: null });
    localStorage.removeItem('clawtube_wallet');
    localStorage.removeItem('clawtube_agent');
    localStorage.removeItem('clawtube_agentName');
    localStorage.removeItem('clawtube_userType');
    localStorage.removeItem('clawtube_agentType');
  }, []);
  const isConnected = solanaState.connected || agentState.connected;
  const activeAddress = solanaState.address || agentState.address;
  const userType = solanaState.connected ? 'human' : agentState.connected ? 'agent' : null;
  return (
    <ClawtubeWalletContext.Provider value={{
      connected: isConnected,
      address: activeAddress,
      userType,
      agentName: agentState.name,
      isConnecting: solanaState.isConnecting,
      connectAgent,
      disconnect,
      connectWallet,
      isSolanaConnected: solanaState.connected,
      solanaAddress: solanaState.address,
    }}>
      {children}
    </ClawtubeWalletContext.Provider>
  );
}
export function useWallet() {
  return useContext(ClawtubeWalletContext);
}
