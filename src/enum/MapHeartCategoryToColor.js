import HEART_COMMENT_CATEGORIES from 'enum/HEARTCommentCategories.js';

export default {
  [HEART_COMMENT_CATEGORIES.story.name]: 'primary',
  [HEART_COMMENT_CATEGORIES.example.name]: 'success',
  [HEART_COMMENT_CATEGORIES.tip.name]: 'accent',
  [HEART_COMMENT_CATEGORIES.resource.name]: 'warning',
  [HEART_COMMENT_CATEGORIES.question.name]: 'error',
}