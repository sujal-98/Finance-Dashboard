
import React from 'react';
import HeaderBox from '../components/HeaderBox';
import TotalBalanceBox from '../components/TotalBalanceBox';
import RightSidebar from '../components/RightSidebar'
import { getLoggedInUser } from '../../lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { getAccount, getAccounts } from '../../lib/actions/bank.actions';
import RecentTransactions from '../components/recentTransactions';

const Home =async ({searchParams:{id,page}}:SearchParamProps) => {

const currentPage=Number(page as String) || 1

  const loggedIn=  await getLoggedInUser()
  if(!loggedIn) redirect('/sign-in')
console.log(loggedIn)
const accounts=await getAccounts({
  userId:loggedIn.$id
})
if(!accounts) return ;
console.log("Accounts ",accounts)
const appwriteItemId=(id as string) || accounts?.data[0]?.appwriteItemId;
console.log("appwrite item id ",appwriteItemId)
const account=await getAccount({appwriteItemId})

console.log("logged ",loggedIn);
console.log("account ",account);


  return (
    
    <section className="home w-9">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
          type="greeting"
          title="Welcome"
          user={loggedIn?.firstName || 'Guest'} 
          subtext="Access and manage your Accounts Transaction Efficiently"/>
          <TotalBalanceBox accounts={accounts?.data} totalBanks={accounts?.totalBanks} totalCurrentBalance={accounts?.totalCurrentBalance} />
        </header>
      <RecentTransactions
      accounts={accounts.data}
      transactions={account?.transactions}
      appwriteItemId={appwriteItemId}
      page={currentPage}
      />
      </div>

      <RightSidebar user={loggedIn} transactions={accounts?.transactions} banks={accounts.data.slice(0,2)} />
    </section>
  )
}

export default Home
