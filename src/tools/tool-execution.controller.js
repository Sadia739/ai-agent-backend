import { getToolExecutions } from "./tool-execution.service.js";
export const getConversationTools = async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);
        const tools = await getToolExecutions(conversationId);
        res.json({
            success: true,
            data: tools,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//# sourceMappingURL=tool-execution.controller.js.map