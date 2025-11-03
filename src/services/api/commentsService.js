import { toast } from 'react-toastify';

const commentsService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  // Get all comments for a specific item from comment_c table
  getAll: async (itemId) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "mentions_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "item_id_c", "Operator": "EqualTo", "Values": [parseInt(itemId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Get team members for author information
      const teamMembers = await commentsService.getTeamMembers();
      
      return response.data.map(comment => ({
        Id: comment.Id,
        itemId: parseInt(itemId),
        content: comment.content_c || '',
        author: teamMembers.find(member => member.Id === comment.author_id_c) || {
          Id: comment.author_id_c,
          name: 'Unknown User',
          email: 'unknown@company.com',
          avatar: null
        },
        mentions: comment.mentions_c ? JSON.parse(comment.mentions_c) : [],
        createdAt: comment.CreatedOn,
        updatedAt: comment.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Get a specific comment by ID from comment_c table
  getById: async (id) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "mentions_c"}},
          {"field": {"Name": "item_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('comment_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error(`Comment with ID ${id} not found`);
      }

      const comment = response.data;
      
      // Get author information
      const teamMembers = await commentsService.getTeamMembers();
      const author = teamMembers.find(member => member.Id === comment.author_id_c);

      return {
        Id: comment.Id,
        itemId: comment.item_id_c,
        content: comment.content_c || '',
        author: author || {
          Id: comment.author_id_c,
          name: 'Unknown User',
          email: 'unknown@company.com',
          avatar: null
        },
        mentions: comment.mentions_c ? JSON.parse(comment.mentions_c) : [],
        createdAt: comment.CreatedOn,
        updatedAt: comment.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  // Create a new comment in comment_c table
  create: async (commentData) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      // Extract mentions from content
      const mentionMatches = commentData.content.match(/@(\w+(?:\.\w+)*)/g) || [];
      const mentions = mentionMatches.map(match => match.substring(1));

      const params = {
        records: [{
          item_id_c: parseInt(commentData.itemId),
          content_c: commentData.content.trim(),
          author_id_c: parseInt(commentData.author?.Id || 1),
          mentions_c: JSON.stringify(mentions)
        }]
      };

      const response = await apperClient.createRecord('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdComment = successful[0].data;
          
          // Get author information
          const teamMembers = await commentsService.getTeamMembers();
          const author = teamMembers.find(member => member.Id === createdComment.author_id_c);

          return {
            Id: createdComment.Id,
            itemId: parseInt(commentData.itemId),
            content: createdComment.content_c,
            author: author || commentData.author || {
              Id: 1,
              name: 'Current User',
              email: 'user@company.com',
              avatar: null
            },
            mentions: JSON.parse(createdComment.mentions_c || '[]'),
            createdAt: createdComment.CreatedOn,
            updatedAt: createdComment.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error);
      return null;
    }
  },

  // Update an existing comment in comment_c table
  update: async (id, updateData) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.content !== undefined) {
        updateRecord.content_c = updateData.content.trim();
        
        // Re-extract mentions if content was updated
        const mentionMatches = updateData.content.match(/@(\w+(?:\.\w+)*)/g) || [];
        const mentions = mentionMatches.map(match => match.substring(1));
        updateRecord.mentions_c = JSON.stringify(mentions);
      }

      const params = { records: [updateRecord] };

      const response = await apperClient.updateRecord('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedComment = successful[0].data;
          
          // Get author information
          const teamMembers = await commentsService.getTeamMembers();
          const author = teamMembers.find(member => member.Id === updatedComment.author_id_c);

          return {
            Id: updatedComment.Id,
            itemId: updatedComment.item_id_c,
            content: updatedComment.content_c,
            author: author || {
              Id: updatedComment.author_id_c,
              name: 'Unknown User',
              email: 'unknown@company.com',
              avatar: null
            },
            mentions: JSON.parse(updatedComment.mentions_c || '[]'),
            createdAt: updatedComment.CreatedOn,
            updatedAt: updatedComment.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error);
      return null;
    }
  },

  // Delete a comment from comment_c table
  delete: async (id) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} comments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return { success: successful.length > 0 };
      }
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      return { success: false };
    }
  },

  // Get team members for mention suggestions from team_member_c table
  getTeamMembers: async () => {
    try {
      const apperClient = commentsService.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "username_c"}}, 
          {"field": {"Name": "email_c"}}
        ],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('team_member_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(member => ({
        Id: member.Id,
        name: member.name_c || 'Unknown User',
        username: member.username_c || 'unknown',
        email: member.email_c || 'unknown@company.com',
        avatar: null,
        role: 'Team Member'
      }));
    } catch (error) {
      console.error("Error fetching team members:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Search comments by content
  search: async (itemId, query) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      let whereConditions = [
        {"FieldName": "item_id_c", "Operator": "EqualTo", "Values": [parseInt(itemId)]}
      ];

      if (query && query.trim()) {
        whereConditions.push({
          "FieldName": "content_c", 
          "Operator": "Contains", 
          "Values": [query.toLowerCase()]
        });
      }

      const params = {
        fields: [
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "mentions_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Get team members for author information
      const teamMembers = await commentsService.getTeamMembers();
      
      return response.data.map(comment => ({
        Id: comment.Id,
        itemId: parseInt(itemId),
        content: comment.content_c || '',
        author: teamMembers.find(member => member.Id === comment.author_id_c) || {
          Id: comment.author_id_c,
          name: 'Unknown User',
          email: 'unknown@company.com',
          avatar: null
        },
        mentions: comment.mentions_c ? JSON.parse(comment.mentions_c) : [],
        createdAt: comment.CreatedOn,
        updatedAt: comment.ModifiedOn
      }));
    } catch (error) {
      console.error("Error searching comments:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Get comments with mentions for a specific user
  getMentions: async (username) => {
    try {
      const apperClient = commentsService.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "mentions_c"}},
          {"field": {"Name": "item_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "mentions_c", "Operator": "Contains", "Values": [username]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Get team members for author information
      const teamMembers = await commentsService.getTeamMembers();
      
      return response.data
        .map(comment => ({
          Id: comment.Id,
          itemId: comment.item_id_c,
          content: comment.content_c || '',
          author: teamMembers.find(member => member.Id === comment.author_id_c) || {
            Id: comment.author_id_c,
            name: 'Unknown User',
            email: 'unknown@company.com',
            avatar: null
          },
          mentions: comment.mentions_c ? JSON.parse(comment.mentions_c) : [],
          createdAt: comment.CreatedOn,
          updatedAt: comment.ModifiedOn
        }))
        .filter(comment => comment.mentions.includes(username));
    } catch (error) {
      console.error("Error fetching mentions:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export { commentsService };