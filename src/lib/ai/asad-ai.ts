import { aiTools } from './tools';
import { extractRequirementFromText, scoreLeadRequirement, ExtractedRequirement, LeadScoreResult } from './lead-extractor';
import { getActiveKnowledgeItems } from './knowledge-service';
import { logAuditEntry } from './audit-logger';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI' | 'AGENT' | 'SYSTEM';
  text: string;
  timestamp: string;
  toolCalls?: string[];
}

export interface AIResponsePayload {
  replyText: string;
  extractedRequirement?: ExtractedRequirement;
  leadScore?: LeadScoreResult;
  suggestedProperties?: unknown[];
  handoffTriggered?: boolean;
}

export async function processAsadAIConversation(
  messages: ChatMessage[],
  conversationId?: string
): Promise<AIResponsePayload> {
  const lastUserMessage = [...messages].reverse().find(m => m.sender === 'USER')?.text || '';
  const lowerText = lastUserMessage.toLowerCase();

  logAuditEntry({
    actor: 'ASAD_AI',
    action: 'process_message',
    conversationId,
    details: { userText: lastUserMessage },
  });

  // Extract requirement & score lead
  const extractedReq = extractRequirementFromText(lastUserMessage);
  const leadScore = scoreLeadRequirement(extractedReq);

  // Check Handoff Intent
  if (lowerText.includes('agent se baat') || lowerText.includes('talk to agent') || lowerText.includes('human agent') || lowerText.includes('call me')) {
    const handoffResult = aiTools.handoff_to_agent({
      conversationId: conversationId || 'web-chat',
      reason: 'Customer requested human agent takeover',
    });

    return {
      replyText: 'Bilkul! Main aap ki conversation humare Senior Investment Advisor Asad Ali se connect kar raha hoon. Agent aap ke saath direct contact karenge.',
      extractedRequirement: extractedReq,
      leadScore,
      handoffTriggered: true,
    };
  }

  // Check Site Visit Intent
  if (lowerText.includes('site visit') || lowerText.includes('visit karwani') || lowerText.includes('mukaam dekhna')) {
    aiTools.schedule_site_visit({
      conversationId,
      scheduledAt: 'Tomorrow 11:00 AM',
      notes: lastUserMessage,
    });

    return {
      replyText: 'Zabardast! Main aap ke liye site visit schedule kar deta hoon. Aap subah 11 baje convenient hain ya koi specific time pasand karenge?',
      extractedRequirement: extractedReq,
      leadScore,
    };
  }

  // Check Installment / ROI Tool Requests
  if (lowerText.includes('installment') || lowerText.includes('kist')) {
    const inst = aiTools.calculate_installment({ totalPrice: extractedReq.budgetMax || 10000000 });
    return {
      replyText: `Ji bilkul! Installment package ka schedule dekhein:\n• Total Price: PKR ${(inst.data.totalPrice / 100000).toFixed(0)} Lakh\n• Down Payment (25%): PKR ${(inst.data.downPaymentAmount / 100000).toFixed(2)} Lakh\n• Monthly Kist: PKR ${inst.data.monthlyInstallment.toLocaleString()} / month\n\nAap custom down payment schedule WhatsApp par bhi mangwa sakte hain.`,
      extractedRequirement: extractedReq,
      leadScore,
    };
  }

  // Search Property Inventory Tool Execution
  const searchResult = aiTools.search_properties({
    society: extractedReq.society,
    maxPrice: extractedReq.budgetMax,
    sizeMarla: extractedReq.size ? parseInt(extractedReq.size) : undefined,
  });

  if (searchResult.data.length > 0) {
    const matched = searchResult.data[0];
    const isUrdu = lowerText.includes('chahiye') || lowerText.includes('mein') || lowerText.includes('kya');

    if (isUrdu) {
      return {
        replyText: `Bilkul! ${matched.society} mein ${matched.sizeMarla} Marla plot demand PKR ${(matched.demandPrice / 100000).toFixed(0)} Lakh tak verified available hai.\n\n📍 Location: ${matched.location}\n📄 NOC Status: ${matched.nocStatus}\n\nAap yeh plot investment ke liye dekh rahe hain ya immediate ghar banane ke liye?`,
        extractedRequirement: extractedReq,
        leadScore,
        suggestedProperties: searchResult.data,
      };
    }

    return {
      replyText: `Certainly! We have a verified listing in ${matched.society} matching your parameters:\n\n• Property: ${matched.title}\n• Demand: PKR ${(matched.demandPrice / 100000).toFixed(2)} Lakh\n• Status: ${matched.devStatus}\n\nWould you like to request the exact registry deed verification or schedule a site visit?`,
      extractedRequirement: extractedReq,
      leadScore,
      suggestedProperties: searchResult.data,
    };
  }

  // Handle Unverified / Unknown Information Safely
  if (lowerText.includes('lahore') || lowerText.includes('karachi') || lowerText.includes('bahria town lahore')) {
    return {
      replyText: 'Asad Land Holdings exclusively focuses on verified real-rate properties in Wah Cantt, Taxila, and Islamabad. Hum doosray sheharon ke unverified listings recommend nahi karte taake aap ka sarmaya mehfooz rahe.',
      extractedRequirement: extractedReq,
      leadScore,
    };
  }

  // General Grounded Reply
  return {
    replyText: `Aap ka shukriya! Asad Land Holdings Wah Cantt office mein aap ka khair-mubarak hai. Main aap ko Kohistan Enclave, New City Phase 2, B-17, aur Faisal Hills ki real transaction rates guide kar sakta hoon. Aap ka budget or plot requirement kya hai?`,
    extractedRequirement: extractedReq,
    leadScore,
  };
}
