import { toast } from 'react-toastify';

class BoardService {
  constructor() {
    // Initialize ApperClient - will be available globally
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Get all boards from board_c table
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "description_c"}}, 
          {"field": {"Name": "columns_c"}}, 
          {"field": {"Name": "groups_c"}}, 
          {"field": {"Name": "favorite_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('board_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database records to expected format
      return response.data.map(board => ({
        Id: board.Id,
        name: board.name_c || 'Untitled Board',
        description: board.description_c || '',
        columns: board.columns_c ? JSON.parse(board.columns_c) : [],
        groups: board.groups_c ? JSON.parse(board.groups_c) : [],
        favorite: board.favorite_c || false,
        createdAt: board.CreatedOn,
        updatedAt: board.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching boards:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get board by ID from board_c table
  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "description_c"}}, 
          {"field": {"Name": "columns_c"}}, 
          {"field": {"Name": "groups_c"}}, 
          {"field": {"Name": "favorite_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

const response = await this.apperClient.getRecordById('board_c', id, params);
      
      if (!response.success || !response.data) {
        return null; // Return null instead of throwing error for missing boards
      }

      const board = response.data;
      
      // Get all board items for this board
      const itemsParams = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "group_id_c"}},
          {"field": {"Name": "column_values_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}]
      };

      const itemsResponse = await this.apperClient.fetchRecords('board_item_c', itemsParams);
      const boardItems = itemsResponse.success ? itemsResponse.data : [];

      // Transform database record to expected format with items
      let groups = board.groups_c ? JSON.parse(board.groups_c) : [];
      
      // Add items to appropriate groups
      groups = groups.map(group => ({
        ...group,
        items: boardItems
          .filter(item => item.group_id_c === group.Id)
          .map(item => ({
            Id: item.Id,
            groupId: group.Id,
            title: item.title_c || 'Untitled Item',
            status: item.status_c || 'Not Started',
            columnValues: item.column_values_c ? JSON.parse(item.column_values_c) : {},
            position: item.position_c || 0,
            createdAt: item.CreatedOn,
            updatedAt: item.ModifiedOn
          }))
      }));

      return {
        Id: board.Id,
        name: board.name_c || 'Untitled Board',
        description: board.description_c || '',
        columns: board.columns_c ? JSON.parse(board.columns_c) : [],
        groups: groups,
        favorite: board.favorite_c || false,
        createdAt: board.CreatedOn,
        updatedAt: board.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching board ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Create new board in board_c table
  async create(boardData) {
    try {
      const params = {
        records: [{
          name_c: boardData.name || 'New Board',
          description_c: boardData.description || '',
          columns_c: JSON.stringify(boardData.columns || []),
          groups_c: JSON.stringify(boardData.groups || []),
          favorite_c: boardData.favorite || false
        }]
      };

      const response = await this.apperClient.createRecord('board_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} boards:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdBoard = successful[0].data;
          return {
            Id: createdBoard.Id,
            name: createdBoard.name_c,
            description: createdBoard.description_c,
            columns: JSON.parse(createdBoard.columns_c || '[]'),
            groups: JSON.parse(createdBoard.groups_c || '[]'),
            favorite: createdBoard.favorite_c,
            createdAt: createdBoard.CreatedOn,
            updatedAt: createdBoard.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating board:", error?.response?.data?.message || error);
    }
  }

  // Update board in board_c table
  async update(id, updates) {
    try {
      const updateData = {};
      if (updates.name !== undefined) updateData.name_c = updates.name;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.columns !== undefined) updateData.columns_c = JSON.stringify(updates.columns);
      if (updates.groups !== undefined) updateData.groups_c = JSON.stringify(updates.groups);
      if (updates.favorite !== undefined) updateData.favorite_c = updates.favorite;

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('board_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} boards:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedBoard = successful[0].data;
          return {
            Id: updatedBoard.Id,
            name: updatedBoard.name_c,
            description: updatedBoard.description_c,
            columns: JSON.parse(updatedBoard.columns_c || '[]'),
            groups: JSON.parse(updatedBoard.groups_c || '[]'),
            favorite: updatedBoard.favorite_c,
            createdAt: updatedBoard.CreatedOn,
            updatedAt: updatedBoard.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating board:", error?.response?.data?.message || error);
    }
  }

  // Delete board from board_c table
  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('board_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} boards:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting board:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Create item in board_item_c table
  async createItem(itemData) {
    try {
      const params = {
        records: [{
          title_c: itemData.title || 'New Item',
          status_c: itemData.status || 'Not Started',
          column_values_c: JSON.stringify(itemData.columnValues || {}),
          group_id_c: parseInt(itemData.groupId),
          position_c: itemData.position || 0,
          board_id_c: parseInt(itemData.boardId || 1)
        }]
      };

      const response = await this.apperClient.createRecord('board_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} items:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdItem = successful[0].data;
          return {
            Id: createdItem.Id,
            title: createdItem.title_c,
            status: createdItem.status_c,
            columnValues: JSON.parse(createdItem.column_values_c || '{}'),
            groupId: createdItem.group_id_c,
            position: createdItem.position_c,
            createdAt: createdItem.CreatedOn,
            updatedAt: createdItem.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating item:", error?.response?.data?.message || error);
    }
  }

  // Update item in board_item_c table
  async updateItem(itemId, updates) {
    try {
      const updateData = {};
      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.status !== undefined) updateData.status_c = updates.status;
      if (updates.columnValues !== undefined) updateData.column_values_c = JSON.stringify(updates.columnValues);
      if (updates.position !== undefined) updateData.position_c = updates.position;

      const params = {
        records: [{
          Id: parseInt(itemId),
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('board_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} items:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedItem = successful[0].data;
          return {
            Id: updatedItem.Id,
            title: updatedItem.title_c,
            status: updatedItem.status_c,
            columnValues: JSON.parse(updatedItem.column_values_c || '{}'),
            position: updatedItem.position_c,
            updatedAt: updatedItem.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating item:", error?.response?.data?.message || error);
    }
  }

  // Delete item from board_item_c table
  async deleteItem(itemId) {
    try {
      const params = { 
        RecordIds: [parseInt(itemId)]
      };
      
      const response = await this.apperClient.deleteRecord('board_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} items:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting item:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Get comments from comment_c table
  async getComments(itemId) {
    try {
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

      const response = await this.apperClient.fetchRecords('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Get team members for author information
      const teamMembers = await this.getTeamMembers();
      
      return response.data.map(comment => ({
        Id: comment.Id,
        itemId: parseInt(itemId),
        content: comment.content_c || '',
        author: teamMembers.find(member => member.Id === comment.author_id_c) || {
          Id: comment.author_id_c,
          name: 'Unknown User',
          email: 'unknown@company.com'
        },
        mentions: comment.mentions_c ? JSON.parse(comment.mentions_c) : [],
        createdAt: comment.CreatedOn,
        updatedAt: comment.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Add comment to comment_c table
  async addComment(itemId, content, authorId = 1) {
    try {
      // Extract mentions from content
      const mentionMatches = content.match(/@(\w+(?:\.\w+)*)/g) || [];
      const mentions = mentionMatches.map(match => match.substring(1));

      const params = {
        records: [{
          item_id_c: parseInt(itemId),
          content_c: content.trim(),
          author_id_c: parseInt(authorId),
          mentions_c: JSON.stringify(mentions)
        }]
      };

      const response = await this.apperClient.createRecord('comment_c', params);
      
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
          const teamMembers = await this.getTeamMembers();
          const author = teamMembers.find(member => member.Id === createdComment.author_id_c);

          return {
            Id: createdComment.Id,
            itemId: parseInt(itemId),
            content: createdComment.content_c,
            author: author || { Id: authorId, name: 'Current User', email: 'user@company.com' },
            mentions: JSON.parse(createdComment.mentions_c || '[]'),
            createdAt: createdComment.CreatedOn,
            updatedAt: createdComment.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error?.response?.data?.message || error);
    }
  }

  // Delete comment from comment_c table
  async deleteComment(commentId) {
    try {
      const params = { 
        RecordIds: [parseInt(commentId)]
      };
      
      const response = await this.apperClient.deleteRecord('comment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      return { success: false };
    }
  }

  // Get team members from team_member_c table
  async getTeamMembers() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "username_c"}}, 
          {"field": {"Name": "email_c"}}
        ],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords('team_member_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(member => ({
        Id: member.Id,
        name: member.name_c || 'Unknown User',
        username: member.username_c || 'unknown',
        email: member.email_c || 'unknown@company.com'
      }));
    } catch (error) {
      console.error("Error fetching team members:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const boardService = new BoardService();