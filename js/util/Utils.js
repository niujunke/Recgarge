
export default class Utils{
  //检查该item 有没有被收藏过
	static checkFavorite(item,items)
  {
     for(var i=0;i<items.length;i++)
     {
        if(item.id.toString===items[i])
        {
          return true;
        }
     } 
     return false;
  } 
}
